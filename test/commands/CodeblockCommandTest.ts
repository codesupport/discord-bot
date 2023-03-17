import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

import CodeblockCommand from "../../src/commands/CodeblockCommand";
import { EMBED_COLOURS } from "../../src/config.json";
import NumberUtils from "../../src/utils/NumberUtils";

describe("CodeblockCommand", () => {
	describe("onInteract()", () => {
		let sandbox: SinonSandbox;
		let command: CodeblockCommand;
		let interaction: any;
		let replyStub: sinon.SinonStub<any[], any>;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new CodeblockCommand();
			replyStub = sandbox.stub().resolves();
			interaction = {
				reply: replyStub,
				user: BaseMocks.getGuildMember()
			};
		});

		it("sends a message to the channel", async () => {
			await command.onInteract(interaction);

			expect(replyStub.calledOnce).to.be.true;
		});

		it("states how to create a codeblock", async () => {
			await command.onInteract(interaction);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Codeblock Tutorial");
			expect(embed.data.description).to.equal("Please use codeblocks when sending code.");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.DEFAULT.toLowerCase()));

			expect(embed.data.fields[0].name).to.equal("Sending lots of code?");
			expect(embed.data.fields[0].value).to.equal("Consider using a [GitHub Gist](http://gist.github.com).");

			expect(embed.data.image.url).to.equal("attachment://codeblock-tutorial.png");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
