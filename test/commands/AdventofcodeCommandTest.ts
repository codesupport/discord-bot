import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { Message } from "discord.js";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

import AdventofcodeCommand from "../../src/commands/AdventofcodeCommand";
import Command from "../../src/abstracts/Command";
import AdventOfCodeService from "../../src/services/AdventOfCodeService";
import { EMBED_COLOURS, ADVENTOFCODE_INVITE, ADVENTOFCODE_LEADERBOARD, ADVENTOFCODE_YEAR } from "../../src/config.json";

const AOCMockData = {
	event: "2021",
	owner_id: "490120",
	members: {
		490120: {
			completion_day_level: {
				1: {
					1: {
						get_star_ts: 1606816563
					}
				}
			},
			local_score: 26,
			global_score: 0,
			name: "Lambo",
			id: "490120",
			stars: 3,
			last_star_ts: "1606899444"
		}
	}
};

describe("Adventofcode Command", () => {
	describe("constructor", () => {
		it("creates a command called adventofcode", () => {
			const command = new AdventofcodeCommand();

			expect(command.getName()).to.equal("adventofcode");
			expect(command.getAliases().includes("aoc")).to.be.true;
		});

		it("creates a command with correct description", () => {
			const command = new AdventofcodeCommand();

			expect(command.getDescription()).to.equal("Shows the current leaderboard for adventofcode.");
		});
	});

	describe("run()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: Command;
		let AOC: AdventOfCodeService;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new AdventofcodeCommand();
			message = BaseMocks.getMessage();
			AOC = AdventOfCodeService.getInstance();
		});

		it("sends a message to the channel", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(AOC, "getLeaderBoard").resolves(AOCMockData);

			await command.run(message);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("Sends a message with the current score", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(AOC, "getLeaderBoard").resolves(AOCMockData);

			await command.run(message);

			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Advent Of Code");
			expect(embed.description).to.equal(`Leaderboard ID: \`${ADVENTOFCODE_INVITE}\`\n\n[View Leaderboard](https://adventofcode.com/${ADVENTOFCODE_YEAR}/leaderboard/private/view/${ADVENTOFCODE_LEADERBOARD})`);
			expect(embed.fields[0].name).to.equal("Top 15");
			expect(embed.fields[0].value).to.equal("```java\n(Name, Stars, Points)\nLambo | 3 | 26\n```");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		it("Gives an error when the wrong acces token/id is provided", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(AOC, "getLeaderBoard").throws();

			await command.run(message);

			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("Could not get the leaderboard for Advent Of Code.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
