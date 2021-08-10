import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { Message } from "discord.js";
import { BaseMocks } from "@lambocreeper/mock-discord.js";;

import MineSweeperCommand from "../../src/commands/MineSweeperCommand";
import Command from "../../src/abstracts/Command";
import MineSweeperService from "../../src/services/MineSweeperService";
import { EMBED_COLOURS } from "../../src/config.json";

describe("MineSweeperCommand", () => {
	describe("constructor", () => {
		it("creates a command called minesweeper", () => {
			const command = new MineSweeperCommand();

			expect(command.getName()).to.equal("minesweeper");
		});

		it("creates a command with correct description", () => {
			const command = new MineSweeperCommand();

			expect(command.getDescription()).to.equal("Generates a minesweeper game.");
		});
	});

	describe("run()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: Command;
		let mineSweeperService: MineSweeperService;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new MineSweeperCommand();
			message = BaseMocks.getMessage();
			mineSweeperService = MineSweeperService.getInstance();
		});

		it("sends a message to the channel", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["easy"]);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("states you should define an existing difficulty, if an incorrect one is given", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["4n4rd2jsas2ednw"]);

			const embed = messageMock.getCall(0).firstArg.embeds[0];

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("You must provide an existing difficulty.");
			expect(embed.fields[0].name).to.equal("Correct Usage");
			expect(embed.fields[0].value).to.equal("?minesweeper [easy|medium|hard]");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("states the result from the MineSweeperService", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			const returnedGame = "||:boom:||||:one:||||:zero:||\n||:one:||||:one:||||:zero:||\n";

			sandbox.stub(mineSweeperService, "generateGame").returns(returnedGame);

			await command.run(message, ["easy"]);

			const embed = messageMock.getCall(0).firstArg.embeds[0];

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("MineSweeper (Easy)");
			expect(embed.description).to.equal(returnedGame);
			expect(embed.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
