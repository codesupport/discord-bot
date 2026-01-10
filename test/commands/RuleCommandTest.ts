import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

import RuleCommand from "../../src/commands/RuleCommand";
import { EMBED_COLOURS } from "../../src/config.json";
import NumberUtils from "../../src/utils/NumberUtils";

describe("RuleCommand", () => {
	describe("run()", () => {
		let sandbox: SinonSandbox;
		let command: RuleCommand;
		let replyStub: sinon.SinonStub<any[], any>;
		let interaction: any;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new RuleCommand();
			replyStub = sandbox.stub().resolves();
			interaction = {
				reply: replyStub,
				user: BaseMocks.getGuildMember()
			};
		});

		it("sends a message to the channel", async () => {
			await command.onInteract("0", undefined, interaction);

			expect(replyStub.calledOnce).to.be.true;
		});

		it("states rule 0 if you ask for rule 0", async () => {
			await command.onInteract("0", undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Info: Asking For Help");
			expect(embed.data.description).to.equal("Help us to help you, instead of just saying \"my code doesn't work\" or \"can someone help me.\" Be specific with your questions, and [don't ask to ask](https://dontasktoask.com).");
			expect(embed.data.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.data.fields[0].value).to.equal("<#240884566519185408>");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.SUCCESS.toLowerCase()));
		});

		it("states rule 1 if you ask for rule 1", async () => {
			await command.onInteract("1", undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Rule: Be Patient");
			expect(embed.data.description).to.equal("Responses to your questions are not guaranteed. The people here offer their expertise on their own time and for free.");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.SUCCESS.toLowerCase()));
			expect(embed.data.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.data.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 2 if you ask for rule 2", async () => {
			await command.onInteract("2", undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Rule: Unsolicited Contact/Bumps");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.SUCCESS.toLowerCase()));
			expect(embed.data.description).to.equal("Do not send unsolicited DMs, bump questions, or ping for questions outside of an established conversation.");
			expect(embed.data.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.data.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 3 if you ask for rule 3", async () => {
			await command.onInteract("3", undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Rule: Be Nice");
			expect(embed.data.description).to.equal("Be respectful; no personal attacks, sexism, homophobia, transphobia, racism, hate speech or other disruptive behaviour.");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.SUCCESS.toLowerCase()));
			expect(embed.data.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.data.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 4 if you ask for rule 4", async () => {
			await command.onInteract("4", undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Rule: No Advertising");
			expect(embed.data.description).to.equal("Don't advertise. If you're not sure whether it would be considered advertising or not, ask a moderator.");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.SUCCESS.toLowerCase()));
			expect(embed.data.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.data.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 5 if you ask for rule 5", async () => {
			await command.onInteract("5", undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Rule: Use The Right Channel");
			expect(embed.data.description).to.equal("Stick to the correct channels. If you're unsure which channel to put your question in, you can ask in [#general](https://codesupport.dev/discord) which channel is best for your question.");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.SUCCESS.toLowerCase()));
			expect(embed.data.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.data.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 6 if you ask for rule 6", async () => {
			await command.onInteract("6", undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Rule: Illegal/Immoral Tasks");
			expect(embed.data.description).to.equal("Don't ask for help with illegal or immoral tasks. Doing so not only risks your continued participation in this community but is in violation of Discord's TOS and can get your account banned.");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.SUCCESS.toLowerCase()));
			expect(embed.data.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.data.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 7 if you ask for rule 7", async () => {
			await command.onInteract("7", undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Rule: No Spoon-feeding");
			expect(embed.data.description).to.equal("No spoon-feeding, it's not useful and won't help anyone learn.");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.SUCCESS.toLowerCase()));
			expect(embed.data.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.data.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 8 if you ask for rule 8", async () => {
			await command.onInteract("8", undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Rule: Use Codeblocks");
			expect(embed.data.description).to.equal("When posting code, please use code blocks (see the command `/codeblock` for help).");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.SUCCESS.toLowerCase()));
			expect(embed.data.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.data.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 9 if you ask for rule 9", async () => {
			await command.onInteract("9", undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Rule: Keep it Clean");
			expect(embed.data.description).to.equal("Keep it appropriate, some people use this at school or at work.");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.SUCCESS.toLowerCase()));
			expect(embed.data.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.data.fields[0].value).to.equal("<#240884566519185408>");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
