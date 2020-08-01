import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { Message } from "discord.js";

// @ts-ignore - TS does not like MockDiscord not living in src/
import MockDiscord from "../MockDiscord";
import RuleCommand from "../../src/commands/RuleCommand";
import Command from "../../src/abstracts/Command";
import { EMBED_COLOURS } from "../../src/config.json";

describe("RuleCommand", () => {
	describe("constructor()", () => {
		it("creates a command called rule", () => {
			const command = new RuleCommand();

			expect(command.getName()).to.equal("rule");
			expect(command.getAliases().includes("rl")).to.be.true;
		});

		it("creates a command with correct description", () => {
			const command = new RuleCommand();

			expect(command.getDescription()).to.equal("Get a specific rule.");
		});
	});

	describe("run()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: Command;
		let discordMock: MockDiscord;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new RuleCommand();
			discordMock = new MockDiscord();
			message = discordMock.getMessage();
		});

		it("sends a message to the channel", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["0"]);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("states you must define a rule number if none is given", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("You must define a rule number.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("states it is an unknown rule trigger if not found in rules object", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["thisruledoesnotexist"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("Unknown rule number/trigger.");
			expect(embed.fields[0].name).to.equal("Correct Usage");
			expect(embed.fields[0].value).to.equal("?rule <rule number/trigger>");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("states rule 0 if you ask for rule 0", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["0"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: Asking For Help");
			expect(embed.description).to.equal("Help us to help you, instead of just saying \"my code doesn't work\" or \"can someone help me.\"");
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		it("states rule 1 if you ask for rule 1", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["1"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: Be Patient");
			expect(embed.description).to.equal("Responses to your questions are not guaranteed. The people here offer their expertise on their own time and for free.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 2 if you ask for rule 2", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["2"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: Unsolicited Contact/Bumps");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.description).to.equal("Do not send unsolicited DMs, bump questions, or ping for questions outside of an established conversation.");
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 3 if you ask for rule 3", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["3"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: Be Nice");
			expect(embed.description).to.equal("Be respectful; no personal attacks, sexism, homophobia, transphobia, racism, hate speech or other disruptive behaviour.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 4 if you ask for rule 4", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["4"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: No Advertising");
			expect(embed.description).to.equal("Don't advertise. If you're not sure whether it would be considered advertising or not, ask a moderator.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 5 if you ask for rule 5", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["5"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: Use The Right Channel");
			expect(embed.description).to.equal("Stick to the correct channels. If you're unsure which channel to put your question in, you can ask in [#general](https://codesupport.dev/discord) which channel is best for your question.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 6 if you ask for rule 6", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["6"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: Illegal/Immoral Tasks");
			expect(embed.description).to.equal("Don't ask for help with illegal or immoral tasks. Doing so not only risks your continued participation in this community but is in violation of Discord's TOS and can get your account banned.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 7 if you ask for rule 7", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["7"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: No Spoon-feeding");
			expect(embed.description).to.equal("No spoon-feeding, it's not useful and won't help anyone learn.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 8 if you ask for rule 8", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["8"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: Use Codeblocks");
			expect(embed.description).to.equal("When posting code, please use code blocks (see `?codeblock` for help).");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 9 if you ask for rule 9", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["9"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: Keep it Clean");
			expect(embed.description).to.equal("Keep it appropriate, some people use this at school or at work.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		afterEach(() => {
			sandbox.reset();
		});
	});
});