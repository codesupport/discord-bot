import { expect } from "chai";
import { Constants } from "discord.js";
import { Message } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";

import MockCommand from "../../MockCommand";
import MockDiscord from "../../MockDiscord";
import CommandFactory from "../../../src/factories/CommandFactory";
import CommandParserHandler from "../../../src/event/handlers/CommandParserHandler";
import { COMMAND_PREFIX, BOTLESS_CHANNELS } from "../../../src/config.json";

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
			sandbox.stub(CommandFactory.prototype, "commandExists").returns(true);

			const runCommandMock = sandbox.stub(command, "run");
			const message = discordMock.getMessage();

			message.content = command.getName();

			await handler.handle(message);

			expect(runCommandMock.called).to.be.false;
		});

		it("should not run command if message was sent on a botless channel", async () => {
			sandbox.stub(CommandFactory.prototype, "commandExists").returns(true);

			const runCommandMock = sandbox.stub(command, "run");
			const message = discordMock.getMessage();

			message.content = COMMAND_PREFIX + command.getName();
			message.channel.id = BOTLESS_CHANNELS.MOCK_CHANNEL;

			await handler.handle(message);

			expect(runCommandMock.called).to.be.false;
		});

		it("should not run a nonexistent command", async () => {
			sandbox.stub(CommandFactory.prototype, "commandExists").returns(false);

			const runCommandMock = sandbox.stub(command, "run");
			const message = discordMock.getMessage();

			message.content = COMMAND_PREFIX + command.getName();
			message.channel.id = "fake-bot-enabled-channel-id-123";

			await handler.handle(message);

			expect(runCommandMock.called).to.be.false;
		});

		it("should run command", async () => {
			sandbox.stub(CommandFactory.prototype, "commandExists").returns(true);
			sandbox.stub(CommandFactory.prototype, "getCommand").returns(command);

			const runCommandMock = sandbox.stub(command, "run");
			const message = discordMock.getMessage();

			message.content = COMMAND_PREFIX + command.getName();
			message.channel.id = "fake-bot-enabled-channel-id-123";

			await handler.handle(message);

			expect(runCommandMock.called).to.be.true;
		});

		it("should delete messages that trigger a self destructing command", async () => {
			sandbox.stub(CommandFactory.prototype, "commandExists").returns(true);
			sandbox.stub(CommandFactory.prototype, "getCommand").returns(command);
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