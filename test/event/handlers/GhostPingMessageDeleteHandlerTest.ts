import { expect } from "chai";
import { Constants, Channel, Message, MessageMentions, Collection, User } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";
import EventHandler from "../../../src/abstracts/EventHandler";
import MockDiscord from "../../MockDiscord";
import GhostPingMessageDeleteHandler from "../../../src/event/handlers/GhostPingMessageDeleteHandler";

describe("GhostPingMessageDeleteHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for MESSAGE_DELETE", () => {
			const handler = new GhostPingMessageDeleteHandler();

			expect(handler.getEvent()).to.equal(Constants.Events.MESSAGE_DELETE);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: EventHandler;
		let discordMock: MockDiscord;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new GhostPingMessageDeleteHandler();
			discordMock = new MockDiscord();
		});

		it("sends a message when a message is deleted that pinged a user", async () => {
			const message = discordMock.getMessage();
			const messageMock = sandbox.stub(message.channel, "send");

			message.mentions = new MessageMentions(message, [discordMock.getUser()], [], false);

			message.content = "Hey <@328194044587147278>!";

			await handler.handle(message);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("does not send a message when a message is deleted that didn't ping a user", async () => {
			const message = discordMock.getMessage();
			const messageMock = sandbox.stub(message.channel, "send");

			message.mentions = new MessageMentions(message, [], [], false);

			message.content = "Hey everybody!";

			await handler.handle(message);

			expect(messageMock.calledOnce).to.be.false;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});

