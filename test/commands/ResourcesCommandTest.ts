import { expect } from "chai";
import { SinonSandbox, createSandbox } from "sinon";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

import Command from "../../src/abstracts/Command";
import ResourcesCommand from "../../src/commands/ResourcesCommand";

describe("ResourcesCommand", () => {
	describe("onInteract()", () => {
		let sandbox: SinonSandbox;
		let command: ResourcesCommand;
		let replyStub: sinon.SinonStub<any[], any>;
		let interaction: any;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new ResourcesCommand();
			replyStub = sandbox.stub().resolves();
			interaction = {
				reply: replyStub,
				user: BaseMocks.getGuildMember()
			};
		});

		it("sends a message to the channel", async () => {
			await command.onInteract(interaction, undefined);

			expect(replyStub.calledOnce).to.be.true;
		});

		it("sends the link to resources page if no argument is given", async () => {
			await command.onInteract(interaction, undefined);

			const { content: url } = replyStub.firstCall.lastArg;

			expect(replyStub.calledOnce).to.be.true;
			expect(url).to.equal("https://codesupport.dev/resources");
		});

		it("sends link to the category page if an argument is given", async () => {
			await command.onInteract(interaction, "javascript");

			const { content: url } = replyStub.firstCall.lastArg;

			expect(replyStub.calledOnce).to.be.true;
			expect(url).to.equal("https://codesupport.dev/resources?category=javascript");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
