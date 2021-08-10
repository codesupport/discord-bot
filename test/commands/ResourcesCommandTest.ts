import { expect } from "chai";
import { SinonSandbox, createSandbox } from "sinon";
import { Message } from "discord.js";
import { BaseMocks } from "updated-mock-discord.js";

import Command from "../../src/abstracts/Command";
import ResourcesCommand from "../../src/commands/ResourcesCommand";

describe("ResourcesCommand", () => {
	describe("constructor()", () => {
		it("creates a command called resources", () => {
			const command = new ResourcesCommand();

			expect(command.getName()).to.equal("resources");
		});

		it("creates a command with correct description", () => {
			const command = new ResourcesCommand();

			expect(command.getDescription()).to.equal("Displays a link to the resources page of CodeSupport's website.");
		});

		it("creates a command with correct aliases", () => {
			const command = new ResourcesCommand();

			expect(command.getAliases().includes("resource")).to.be.true;
		});
	});

	describe("run()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: Command;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new ResourcesCommand();
			message = BaseMocks.getMessage();
		});

		it("sends a message to the channel", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, []);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("sends the link to resources page if no argument is given", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, []);

			const url = messageMock.firstCall.lastArg;

			expect(messageMock.calledOnce).to.be.true;
			expect(url).to.equal("https://codesupport.dev/resources");
		});

		it("sends link to the category page if an argument is given", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["javascript"]);

			const url = messageMock.firstCall.lastArg;

			expect(messageMock.calledOnce).to.be.true;
			expect(url).to.equal("https://codesupport.dev/resources?category=javascript");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
