import { expect } from "chai";
import { SinonSandbox, createSandbox } from "sinon";
import ResourcesCommand from "../../src/commands/ResourcesCommand";
import { Message } from "discord.js";
import Command from "../../src/abstracts/Command";
import MockDiscord from "../MockDiscord";

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
		let discordMock: MockDiscord;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new ResourcesCommand();
			discordMock = new MockDiscord();
			message = discordMock.getMessage();
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
	});
});
