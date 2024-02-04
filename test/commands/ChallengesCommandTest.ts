import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

import ChallengesCommand from "../../src/commands/ChallengesCommand";
import { EMBED_COLOURS } from "../../src/config.json";
import NumberUtils from "../../src/utils/NumberUtils";

describe("ChallengesCommand", () => {
	describe("onInteract()", () => {
		let sandbox: SinonSandbox;
		let command: ChallengesCommand;
		let interaction: any;
		let replyStub: sinon.SinonStub<any[], any>;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new ChallengesCommand();
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

		it("posts the image properly", async () => {
			await command.onInteract(interaction);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Programming Challenges");
			expect(embed.data.description).to.equal("Try some of these!");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.DEFAULT.toLowerCase()));

			expect(embed.data.image.url).to.equal("attachment://programming_challenges_v4.0.png");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
