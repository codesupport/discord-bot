import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { Message } from "discord.js";

// @ts-ignore - TS does not like MockDiscord not living in src/
import MockDiscord from "../MockDiscord";
import Command from "../../src/abstracts/Command";
import CodeblockCommand from "../../src/commands/CodeblockCommand";
import { EMBED_COLOURS } from "../../src/config.json";

describe("CodeblockCommand", () => {
	describe("constructor()", () => {
		it("creates a command called codeblock", () => {
			const command = new CodeblockCommand();

			expect(command.getName()).to.equal("codeblock");
		});

		it("creates a command with correct description", () => {
			const command = new CodeblockCommand();

			expect(command.getDescription()).to.equal("Shows a tutorial on how to use Discord's codeblocks.");
		});

		it("creates a command with correct aliases", () => {
			const command = new CodeblockCommand();

			expect(command.getAliases().includes("cb")).to.be.true;
			expect(command.getAliases().includes("codeblocks")).to.be.true;
		});
	});

	describe("run()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: Command;
		let discordMock: MockDiscord;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new CodeblockCommand();
			discordMock = new MockDiscord();
			message = discordMock.getMessage();
		});

		it("sends a message to the channel", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["1"]);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("states how to create a codeblock", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Codeblock Tutorial");
			expect(embed.description).to.equal("Please use codeblocks when sending code.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());

			expect(embed.fields[0].name).to.equal("Sending lots of code?");
			expect(embed.fields[0].value).to.equal("Consider using a [GitHub Gist](http://gist.github.com).");

			expect(embed.image.url).to.equal("attachment://codeblock-tutorial.png");
		});

		afterEach(() => {
			sandbox.reset();
		});
	});
});