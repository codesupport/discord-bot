import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import {Collection, GuildMemberManager, Message} from "discord.js";
import {BaseMocks, CustomMocks} from "@lambocreeper/mock-discord.js";

import InspectCommand from "../../src/commands/InspectCommand";
import Command from "../../src/abstracts/Command";
import { EMBED_COLOURS } from "../../src/config.json";

describe("InspectCommand", () => {
	describe("constructor()", () => {
		it("creates a command called inspect", () => {
			const command = new InspectCommand();

			expect(command.getName()).to.equal("inspect");
		});

		it("creates a command with correct description", () => {
			const command = new InspectCommand();

			expect(command.getDescription()).to.equal("Show information about a given user");
		});
	});

	describe("run()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: Command;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new InspectCommand();
			message = BaseMocks.getMessage();
		});

		it("sends a message to the channel", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["User"]);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("sends an error message when user is not found", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["User"]);

			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("Unable to inspect user");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("sends a message with information if the argument was a username", async () => {
			const guild = CustomMocks.getGuild({});
			const message = CustomMocks.getMessage({guild: guild});
			const messageMock = sandbox.stub(message.channel, "send");

			// Doesn't work, WIP

			await command.run(message, ["BlackBearFTW#1331"]);

			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.contains("Inspecting");
			expect(embed.fields[0].name).to.equal("User ID");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});