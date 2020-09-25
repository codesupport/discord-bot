import { expect } from "chai";
import { Constants } from "discord.js";
import { Message } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";

import MockCommand from "../../MockCommand";
import MockDiscord from "../../MockDiscord";
import CommandFactory from "../../../src/factories/CommandFactory";
import CommandParserHandler from "../../../src/event/handlers/CommandParserHandler";
import * as getConfigValue from "../../../src/utils/getConfigValue";
import { COMMAND_PREFIX } from "../../../src/config.json";
import Command from "../../../src/abstracts/Command";

describe("CommandParserHandler", () => {
	describe("constructor()", () => {
		let sandbox: SinonSandbox;

		beforeEach(() => {
			sandbox = createSandbox();
		});

		it("creates a handler for MESSAGE_CREATE", () => {
			const handler = new CommandParserHandler();

			expect(handler.getEvent()).to.equal(Constants.Events.MESSAGE_CREATE);
		});

		it("should call loadCommands()", () => {
			const factoryMock = sandbox.stub(CommandFactory.prototype, "loadCommands");

			const handler = new CommandParserHandler();

			expect(factoryMock.calledOnce).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe("handle", () => {
		let sandbox: SinonSandbox;
		let handler: CommandParserHandler;
		let discordMock: MockDiscord;
		let command: MockCommand;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new CommandParserHandler();
			discordMock = new MockDiscord();
			command = new MockCommand();
		});

		it("should not run command if it doesn't start with command prefix", async () => {
			sandbox.stub(CommandFactory.prototype, "commandOrAliasExists").returns(true);

			const runCommandMock = sandbox.stub(command, "run");
			const message = discordMock.getMessage();

			message.content = command.getName();

			await handler.handle(message);

			expect(runCommandMock.called).to.be.false;
		});

		it("should not run command if message was sent on a botless channel", async () => {
			sandbox.stub(CommandFactory.prototype, "commandOrAliasExists").returns(true);
			sandbox.stub(getConfigValue, "default").returns({ MOCK_CHANNEL: "mock-channel-lol"});

			const runCommandMock = sandbox.stub(command, "run");
			const message = discordMock.getMessage();

			message.content = COMMAND_PREFIX + command.getName();
			message.channel.id = "mock-channel-lol";

			await handler.handle(message);

			expect(runCommandMock.called).to.be.false;
		});

		it("should not run a nonexistent command", async () => {
			sandbox.stub(CommandFactory.prototype, "commandOrAliasExists").returns(false);

			const runCommandMock = sandbox.stub(command, "run");
			const message = discordMock.getMessage();

			message.content = COMMAND_PREFIX + command.getName();
			message.channel.id = "fake-bot-enabled-channel-id-123";

			await handler.handle(message);

			expect(runCommandMock.called).to.be.false;
		});

		it("should not throw error if message consists in command prefix", async () => {
			const message = discordMock.getMessage();

			message.content = COMMAND_PREFIX;
			message.channel.id = "fake-bot-enabled-channel-id";

			let errorWasThrown = false;

			try {
				await handler.handle(message);
			} catch (error) {
				errorWasThrown = true;
			}

			expect(errorWasThrown).to.be.false;
		});

		it("should run command", async () => {
			sandbox.stub(CommandFactory.prototype, "commandOrAliasExists").returns(true);
			sandbox.stub(CommandFactory.prototype, "getCommandsAndAliases").returns(command);

			const runCommandMock = sandbox.stub(command, "run");
			const message = discordMock.getMessage();

			message.content = COMMAND_PREFIX + command.getName();
			message.channel.id = "fake-bot-enabled-channel-id-123";

			await handler.handle(message);

			expect(runCommandMock.called).to.be.true;
		});

		it("should delete messages that trigger a self destructing command", async () => {
			sandbox.stub(CommandFactory.prototype, "commandOrAliasExists").returns(true);
			sandbox.stub(CommandFactory.prototype, "getCommandsAndAliases").returns(command);
			sandbox.stub(MockCommand.prototype, "isSelfDestructing").returns(true);

			const deleteMessageMock = sandbox.stub(Message.prototype, "delete");
			const message = discordMock.getMessage();

			message.content = COMMAND_PREFIX + command.getName();
			message.channel.id = "fake-bot-enabled-channel-id-123";

			await handler.handle(message);

			expect(deleteMessageMock.called).to.be.true;
		});

		afterEach(() => {
			sandbox.reset();
			sandbox.restore();
		});
	});
});