import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { Message } from "discord.js";

import CommandListCommand from "../../src/commands/CommandListCommand";
import Command from "../../src/abstracts/Command";
// @ts-ignore - TS does not like MockDiscord not living in src/
import MockDiscord from "../MockDiscord";
import {EMBED_COLOURS} from "../../src/config.json";

describe("CommandListCommand", () => {
	describe("constructor()", () => {
		it("creates a command called commands", () => {
			const command = new CommandListCommand();

			expect(command.getName()).to.equal("commands");
		});

		it("creates a command with correct description", () => {
			const command = new CommandListCommand();

			expect(command.getDescription()).to.equal("Lists all the bot commands.");
		});

		it("creates a command with correct aliases", () => {
			const command = new CommandListCommand();

			expect(command.getAliases().includes("command")).to.be.true;
			expect(command.getAliases().includes("help")).to.be.true;
		});
	});

	describe("setCommands()", () => {
		it("sets the commands", () => {
			const command = new CommandListCommand();

			command.setCommands([
				new CommandListCommand()
			]);

			expect(command.commands).to.deep.equal([
				new CommandListCommand()
			]);
		});
	});

	describe("run()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: CommandListCommand;
		let discordMock: MockDiscord;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new CommandListCommand();
			discordMock = new MockDiscord();
			message = discordMock.getMessage();
		});

		it("sends am embed to the channel with all the command names and descriptions", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			command.setCommands([
				new CommandListCommand()
			]);

			await command.run(message, []);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Commands");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
			expect(embed.fields[0].name).to.equal("?commands");
			expect(embed.fields[0].value).to.equal("Lists all the bot commands.");
		});

		it("sends an embed with specific command information if supplied", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			command.setCommands([
				new CommandListCommand()
			]);

			await command.run(message, ["commands"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Commands • ?commands");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
			expect(embed.description).to.equal("Lists all the bot commands.");
			expect(embed.fields[0].name).to.equal("Aliases");
			expect(embed.fields[0].value).to.equal("`?help`, `?command`");
		});

		it("sends an embed with an error if the supplied command does not exist", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			command.setCommands([
				new CommandListCommand()
			]);

			await command.run(message, ["command-not-exist"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
			expect(embed.description).to.equal("That command does not exist.");
		});

		afterEach(() => sandbox.reset());
	});
});