import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { Message } from "discord.js";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

import Command from "../../src/abstracts/Command";
import DuckCommand from "../../src/commands/DuckCommand";

describe("DuckCommand", () => {
	describe("constructor()", () => {
		it("creates a command called duck", () => {
			const command = new DuckCommand();

			expect(command.getName()).to.equal("duck");
			expect(command.getAliases().includes("ddg")).to.be.true;
			expect(command.getAliases().includes("lmddgtfy")).to.be.true;
		});

		it("creates a command with correct description", () => {
			const command = new DuckCommand();

			expect(command.getDescription()).to.equal("Helps other people use duckduckgo to search for answers.");
		});
	});

	describe("run()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: Command;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new DuckCommand();
			message = BaseMocks.getMessage();
		});

		it("sends a message to the channel", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["argument"]);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("does not send anything if no argument is given", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, []);

			expect(messageMock.calledOnce).to.be.false;
		});

		it("sends the link to lmddgtfy + addon if argument is given", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["test"]);

			expect(messageMock.firstCall.firstArg).to.equal("https://lmddgtfy.net/?q=test");
			expect(messageMock.calledOnce).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});