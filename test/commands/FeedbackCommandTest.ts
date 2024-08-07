import {createSandbox, SinonSandbox, SinonStub} from "sinon";
import FeedbackCommand from "../../src/commands/FeedbackCommand";
import {CommandInteraction, ModalSubmitInteraction} from "discord.js";
import {expect} from "chai";

describe("FeedbackCommand", () => {
	let sandbox: SinonSandbox;
	let command: FeedbackCommand;

	beforeEach(() => {
		sandbox = createSandbox();
		command = new FeedbackCommand();
	});

	afterEach(() => sandbox.restore());

	describe("onInteract()", () => {
		it("sends a feedback modal to the user", async () => {
			const showModalMock = sandbox.stub();

			await command.onInteract({
				showModal: showModalMock
			} as unknown as CommandInteraction);

			expect(showModalMock.calledOnce).to.be.true;
			expect(JSON.stringify(showModalMock.args[0][0])).to.equal(JSON.stringify({
				title: "Anonymous Feedback",
				custom_id: "feedback-form",
				components: [
					{
						type: 1,
						components: [
							{
								type: 4,
								custom_id: "feedback-input",
								label: "Your Feedback",
								style: 2
							}
						]
					}
				]
			}));
		});
	});

	describe("onModalSubmit()", () => {
		let interaction: ModalSubmitInteraction;
		let startThreadMock: SinonStub;
		let sendMock: SinonStub;
		let replyMock: SinonStub;
		let fetchMock: SinonStub;

		beforeEach(() => {
			startThreadMock = sandbox.stub();
			replyMock = sandbox.stub();

			sendMock = sandbox.stub().resolves({
				startThread: startThreadMock
			});

			fetchMock = sandbox.stub().resolves({
				send: sendMock
			});

			interaction = {
				fields: {
					getTextInputValue: (_id: string) => "Feedback submitted goes here"
				},
				guild: {
					channels: {
						fetch: fetchMock
					}
				},
				reply: replyMock
			} as unknown as ModalSubmitInteraction;
		});

		it("sends a copy of the feedback to the feedback channel and creates a thread", async () => {
			await command.onModalSubmit(interaction);

			expect(fetchMock.calledOnce).to.be.true;

			expect(sendMock.calledOnce).to.be.true;
			expect(JSON.stringify(sendMock.args[0][0])).to.equal(JSON.stringify({
				embeds: [
					{
						title: "New Anonymous Feedback",
						description: "Feedback submitted goes here"
					}
				]
			}));

			expect(startThreadMock.calledOnce).to.be.true;
		});

		it("sends a copy of the feedback to the submitter", async () => {
			await command.onModalSubmit(interaction);

			expect(fetchMock.calledOnce).to.be.true;

			expect(replyMock.calledOnce).to.be.true;
			expect(JSON.stringify(replyMock.args[0][0])).to.equal(JSON.stringify({
				content: "Thank you, the following feedback has been submitted:",
				ephemeral: true,
				embeds: [
					{
						title: "New Anonymous Feedback",
						description: "Feedback submitted goes here"
					}
				]
			}));
		});
	});
});
