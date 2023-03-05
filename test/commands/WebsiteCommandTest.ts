import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { BaseMocks } from "@lambocreeper/mock-discord.js";
import {Interaction} from "discord.js";

import WebsiteCommand from "../../src/commands/WebsiteCommand";

describe("WebsiteCommand", () => {
	describe("oninteract()", () => {
		let sandbox: SinonSandbox;
		let command: WebsiteCommand;
		let interaction: Interaction;
		let replyStub: sinon.SinonStub;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new WebsiteCommand();
			replyStub = sandbox.stub().resolves();
			interaction = {
				reply: replyStub,
				user: BaseMocks.getGuildMember()
			};
		});

		it("sends a message to the channel", async () => {
			await command.onInteract(undefined, interaction);

			expect(replyStub.calledOnce).to.be.true;
		});

		it("sends default link to website if no argument is given", async () => {
			await command.onInteract(undefined, interaction);

			expect(replyStub.firstCall.firstArg).to.equal("https://codesupport.dev/");
			expect(replyStub.calledOnce).to.be.true;
		});

		it("sends the link to website + addon if argument is given", async () => {
			await command.onInteract("test", interaction);

			expect(replyStub.firstCall.firstArg).to.equal("https://codesupport.dev/test");
			expect(replyStub.calledOnce).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});