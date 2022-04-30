import { expect } from "chai";
import { SinonSandbox, createSandbox } from "sinon";
import ResourcesCommand from "../../../src/commands/slash/ResourcesCommand";

describe("ResourcesCommand", () => {
	describe("onInteract()", () => {
		let sandbox: SinonSandbox;
		let command: ResourcesCommand;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new ResourcesCommand();
		});

		it("sends a message to the channel", async () => {
			const replyStub = sandbox.stub().resolves();

			await command.onInteract(undefined, {
				reply: replyStub
			});

			expect(replyStub.calledOnce).to.be.true;
		});

		it("sends the link to resources page if no argument is given", async () => {
			const replyStub = sandbox.stub().resolves();

			await command.onInteract(undefined, {
				reply: replyStub
			});

			const { content: url } = replyStub.firstCall.lastArg;

			expect(replyStub.calledOnce).to.be.true;
			expect(url).to.equal("https://codesupport.dev/resources");
		});

		it("sends link to the category page if an argument is given", async () => {
			const replyStub = sandbox.stub().resolves();

			await command.onInteract("javascript", {
				reply: replyStub
			});

			const { content: url } = replyStub.firstCall.lastArg;

			expect(replyStub.calledOnce).to.be.true;
			expect(url).to.equal("https://codesupport.dev/resources?category=javascript");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
