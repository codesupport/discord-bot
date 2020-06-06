import { expect } from "chai";
import { SinonSandbox, createSandbox } from "sinon";
import { Message } from "discord.js";
import axios from "axios";

import NPMCommand from "../../src/commands/NPMCommand";
import Command from "../../src/abstracts/Command";
import MockDiscord from "../MockDiscord";

describe("NPMCommand", () => {
	describe("constructor()", () => {
		it("creates a command called npm", () => {
			const command = new NPMCommand();

			expect(command.getName()).to.equal("npm");
		});

		it("creates a command with correct description", () => {
			const command = new NPMCommand();

			expect(command.getDescription()).to.equal("Displays a link to a given NPM package.");
		});
	});

	describe("run()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: Command;
		let discordMock: MockDiscord;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new NPMCommand();
			discordMock = new MockDiscord();
			message = discordMock.getMessage();
		});

		it("sends a message to the channel", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(axios, "get");

			await command.run(message, ["discord.js"]);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("states you must provide a NPM package if none is given", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, []);

			const embed = messageMock.getCall(0).lastArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("You must provide a NPM package.");
			expect(embed.fields[0].name).to.equal("Correct Usage");
			expect(embed.fields[0].value).to.equal("?npm <package>");
		});

		it("states the package name is not valid if it doesn't find a package", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(axios, "get").rejects({ status: 404 });

			await command.run(message, ["mongoboy"]);

			const embed = messageMock.getCall(0).lastArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("That is not a valid NPM package.");
		});

		it("sends a message with the package URL if you provide a valid package", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(axios, "get").resolves({ status: 200 });

			await command.run(message, ["factory-girl"]);

			const url = messageMock.getCall(0).lastArg;

			expect(messageMock.calledOnce).to.be.true;
			expect(url).to.equal("https://www.npmjs.com/package/factory-girl");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});