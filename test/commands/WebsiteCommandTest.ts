import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { Message } from "discord.js";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

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

			expect(command.getDescription()).to.equal("Displays the website with given parameter");
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

			await command.run(message);

			expect(messageMock.calledOnce).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});