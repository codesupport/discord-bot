import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { Message } from "discord.js";
import { BaseMocks } from "updated-mock-discord.js";

import WebsiteCommand from "../../src/commands/WebsiteCommand";
import Command from "../../src/abstracts/Command";

describe("WebsiteCommand", () => {
	describe("constructor()", () => {
		it("creates a command called website", () => {
			const command = new WebsiteCommand();

			expect(command.getName()).to.equal("website");
			expect(command.getAliases().includes("web")).to.be.true;
		});

		it("creates a command with correct description", () => {
			const command = new WebsiteCommand();

			expect(command.getDescription()).to.equal("Displays a link to the CodeSupport's website (or a specific page if specified).");
		});
	});

	describe("run()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: Command;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new WebsiteCommand();
			message = BaseMocks.getMessage();
		});

		it("sends a message to the channel", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, []);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("sends default link to website if no argument is given", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, []);

			expect(messageMock.firstCall.firstArg).to.equal("https://codesupport.dev/");
			expect(messageMock.calledOnce).to.be.true;
		});

		it("sends the link to website + addon if argument is given", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["test"]);

			expect(messageMock.firstCall.firstArg).to.equal("https://codesupport.dev/test");
			expect(messageMock.calledOnce).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});