import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

import AdventOfCodeCommand from "../../src/commands/AdventOfCodeCommand";
import AdventOfCodeService from "../../src/services/AdventOfCodeService";
import { EMBED_COLOURS, ADVENT_OF_CODE_INVITE, ADVENT_OF_CODE_LEADERBOARD, ADVENT_OF_CODE_RESULTS_PER_PAGE } from "../../src/config.json";
import { AOCLeaderBoard } from "../../src/interfaces/AdventOfCode";

const AOCMockData: AOCLeaderBoard = {
	event: "2021",
	owner_id: "490120",
	members: {
		490120: {
			completion_day_level: {
				1: {
					1: {
						get_star_ts: "1606816563"
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

describe("Advent Of Code Command", () => {
	describe("onInteract()", () => {
		let sandbox: SinonSandbox;
		let command: AdventOfCodeCommand;
		let AOC: AdventOfCodeService;
		let interaction: any;
		let replyStub: sinon.SinonStub<any[], any>;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new AdventOfCodeCommand();
			AOC = AdventOfCodeService.getInstance();
			replyStub = sandbox.stub().resolves();
			interaction = {
				reply: replyStub,
				user: BaseMocks.getGuildMember()
			};
		});

		it("sends a message to the channel", async () => {
			sandbox.stub(AOC, "getLeaderBoard");
			sandbox.stub(AOC, "getSortedPlayerList");
			sandbox.stub(AOC, "getSinglePlayer");

			await command.onInteract(2021, "Lambo", interaction);

			expect(replyStub.calledOnce).to.be.true;
		});

		it("sends an error message when the year is too far into the feature", async () => {
			sandbox.stub(AOC, "getLeaderBoard").throws();
			sandbox.stub(command, "getYear").returns(2019);

			await command.onInteract(2021, undefined, interaction);
			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("Year requested not available.\nPlease query a year between 2015 and 2019");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
			expect(replyStub.getCall(0).firstArg.ephemeral).to.be.true;
		});

		it("should query the year 2018 from the AOC Service", async () => {
			const serviceMock = sandbox.stub(AOC, "getLeaderBoard").resolves({ members: {}, event: "2018", owner_id: "12345" });

			sandbox.stub(command, "getYear").returns(2020);

			await command.onInteract(2018, undefined, interaction);

			expect(serviceMock.calledOnce).to.be.true;
			expect(serviceMock.getCall(0).args[1]).to.equal(2018);
			expect(replyStub.calledOnce).to.be.true;
		});

		it("sends a message with the current score", async () => {
			sandbox.stub(AOC, "getLeaderBoard").resolves(AOCMockData);
			sandbox.stub(command, "getYear").returns(2019);

			await command.onInteract(undefined, undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Advent Of Code");
			expect(embed.description).to.equal(`Leaderboard ID (2019): \`${ADVENT_OF_CODE_INVITE}\`\n\n[View Leaderboard (2019)](https://adventofcode.com/2019/leaderboard/private/view/${ADVENT_OF_CODE_LEADERBOARD})`);
			expect(embed.fields[0].name).to.equal(`Top ${ADVENT_OF_CODE_RESULTS_PER_PAGE}`);
			expect(embed.fields[0].value).to.equal("```java\n(Name, Stars, Points)\n 1) Lambo | 3 | 26\n```");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		it("gives an error when the wrong acces token/id is provided", async () => {
			sandbox.stub(AOC, "getLeaderBoard").throws();

			await command.onInteract(undefined, undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("Could not get the leaderboard for Advent Of Code.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
			expect(replyStub.getCall(0).firstArg.ephemeral).to.be.true;
		});

		it("gives back one user when giving a username argument", async () => {
			sandbox.stub(AOC, "getLeaderBoard").resolves(AOCMockData);
			sandbox.stub(command, "getYear").returns(2021);

			await command.onInteract(undefined, "Lambo", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Advent Of Code");
			expect(embed.description).to.equal(`Leaderboard ID (2021): \`${ADVENT_OF_CODE_INVITE}\`\n\n[View Leaderboard (2021)](https://adventofcode.com/2021/leaderboard/private/view/${ADVENT_OF_CODE_LEADERBOARD})`);
			expect(embed.fields[0].name).to.equal("Scores of Lambo in 2021");
			expect(embed.fields[0].value).to.equal("\u200B");
			expect(embed.fields[1].name).to.equal("Position");
			expect(embed.fields[1].value).to.equal("1");
			expect(embed.fields[2].name).to.equal("Stars");
			expect(embed.fields[2].value).to.equal("3");
			expect(embed.fields[3].name).to.equal("Points");
			expect(embed.fields[3].value).to.equal("26");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		it("should give an error when the user doesn't exist", async () => {
			sandbox.stub(AOC, "getLeaderBoard").resolves(AOCMockData);

			await command.onInteract(undefined, "Bob", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("Could not get the user requested\nPlease make sure you typed the name correctly");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
			expect(replyStub.getCall(0).firstArg.ephemeral).to.be.true;
		});

		it("gives an error when the name parameter is given but wrong acces token/id is provided", async () => {
			sandbox.stub(AOC, "getSinglePlayer").throws();

			await command.onInteract(undefined, "Lambo", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("Could not get the statistics for Advent Of Code.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
			expect(replyStub.getCall(0).firstArg.ephemeral).to.be.true;
		});

		it("requesting a different year than current", async () => {
			const APIMock = sandbox.stub(AOC, "getLeaderBoard").resolves(AOCMockData);

			sandbox.stub(command, "getYear").returns(2020);

			await command.onInteract(2019, undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(APIMock.getCall(0).args[1]).to.equal(2019);
			expect(embed.title).to.equal("Advent Of Code");
			expect(embed.description).to.equal(`Leaderboard ID (2020): \`${ADVENT_OF_CODE_INVITE}\`\n\n[View Leaderboard (2019)](https://adventofcode.com/2019/leaderboard/private/view/${ADVENT_OF_CODE_LEADERBOARD})`);
			expect(embed.fields[0].name).to.equal(`Top ${ADVENT_OF_CODE_RESULTS_PER_PAGE}`);
			expect(embed.fields[0].value).to.equal("```java\n(Name, Stars, Points)\n 1) Lambo | 3 | 26\n```");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		it("gives back user from requested year", async () => {
			const APIMock = sandbox.stub(AOC, "getLeaderBoard").resolves(AOCMockData);

			sandbox.stub(command, "getYear").returns(2021);

			await command.onInteract(2018, "Lambo", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Advent Of Code");
			expect(embed.description).to.equal(`Leaderboard ID (2021): \`${ADVENT_OF_CODE_INVITE}\`\n\n[View Leaderboard (2018)](https://adventofcode.com/2018/leaderboard/private/view/${ADVENT_OF_CODE_LEADERBOARD})`);
			expect(embed.fields[0].name).to.equal("Scores of Lambo in 2018");
			expect(embed.fields[0].value).to.equal("\u200B");
			expect(embed.fields[1].name).to.equal("Position");
			expect(embed.fields[1].value).to.equal("1");
			expect(embed.fields[2].name).to.equal("Stars");
			expect(embed.fields[2].value).to.equal("3");
			expect(embed.fields[3].name).to.equal("Points");
			expect(embed.fields[3].value).to.equal("26");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});