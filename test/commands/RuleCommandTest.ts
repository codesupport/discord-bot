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

			await command.run(message, ["1"]);

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

		it("states rule 1 if you ask for rule 1", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["1"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: Asking For Help");
			expect(embed.description).to.equal("Actually ask your question, don't just ask for \"help\".");
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		it("states rule 2 if you ask for rule 2", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["2"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: Explain What's Wrong");
			expect(embed.description).to.equal("Don't ask why your code doesn't \"work\".");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 3 if you ask for rule 3", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["3"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: Be Patient");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.description).to.equal("Responses to your questions are not guaranteed. The people here offer their expertise on their own time and for free.");
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 4 if you ask for rule 4", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["4"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: @Mentioning People");
			expect(embed.description).to.equal("Do not ping a user or group regarding coding help unless you are responding to them in an existing conversation.");
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
			expect(embed.title).to.equal("Rule: Keep it clean.");
			expect(embed.description).to.equal("Keep it clean; some people use this at work/school.");
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
			expect(embed.title).to.equal("Rule: Privacy");
			expect(embed.description).to.equal("Don't share private information with anyone! (you’re just asking to be hacked)");
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
			expect(embed.title).to.equal("Rule: No Advertising");
			expect(embed.description).to.equal("Don't advertise, it's as simple as that.");
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
			expect(embed.title).to.equal("Rule: Use The Right Channel");
			expect(embed.description).to.equal("Stick to the appropriate channels. Feel free to ask in [#general](https://discord.gg/qZfADKn) if you're not sure where to ask something.");
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
			expect(embed.title).to.equal("Rule: Use Codeblocks");
			expect(embed.description).to.equal("When posting code, please use code blocks (see `?codeblock` for help).");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 10 if you ask for rule 10", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["10"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: Bot Additions");
			expect(embed.description).to.equal("Don't ask for your bot to be added. It won’t be.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 11 if you ask for rule 11", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["11"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: Verified Role");
			expect(embed.description).to.equal("Don't ask to become Verified: doing so will make it less likely.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 12 if you ask for rule 12", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["12"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: Don't Ask Someone To Help In DMs");
			expect(embed.description).to.equal("Don't DM people (unless it's for #hiring-or-looking), the knowledge shared here is for the benefit of everyone.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 13 if you ask for rule 13", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["13"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: Illegal/Immoral Tasks");
			expect(embed.description).to.equal("Don't ask for help with illegal or immoral tasks. Doing so not only risks your continued participation in this community but is in violation of Discord's TOS and can get your account banned.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		it("states rule 14 if you ask for rule 14", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["14"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Rule: No Spoon-feeding");
			expect(embed.description).to.equal("No spoon-feeding, it's not useful and won't help anyone learn.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
			expect(embed.fields[0].name).to.equal("To familiarise yourself with all of the server's rules please see");
			expect(embed.fields[0].value).to.equal("<#240884566519185408>");
		});

		afterEach(() => {
			sandbox.reset();
		});
	});
});