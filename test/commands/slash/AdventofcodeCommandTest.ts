import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { BaseMocks } from "@lambocreeper/mock-discord.js";
import AdventofcodeCommand from "../../../src/commands/slash/AdventofcodeCommand";
import AdventOfCodeService from "../../../src/services/AdventOfCodeService";
import { EMBED_COLOURS, ADVENT_OF_CODE_INVITE, ADVENT_OF_CODE_LEADERBOARD, ADVENT_OF_CODE_RESULTS_PER_PAGE } from "../../../src/config.json";
import { AOCLeaderBoard } from "../../../src/interfaces/AdventOfCode";

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

describe("Adventofcode Command", () => {
	describe("onInteract()", () => {
		let sandbox: SinonSandbox;
		let command: AdventofcodeCommand;
		let interaction: any;
		let replyStub: sinon.SinonStub<any[], any>;
		let AOC: AdventOfCodeService;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new AdventofcodeCommand();
			replyStub = sandbox.stub().resolves();
			interaction = {
				reply: replyStub,
				user: BaseMocks.getGuildMember()
			};
			AOC = AdventOfCodeService.getInstance();
		});

		it("sends a message to the channel", async () => {
			sandbox.stub(AOC, "getLeaderBoard").resolves(AOCMockData);

			await command.onInteract(undefined, interaction);

			expect(replyStub.calledOnce).to.be.true;
		});

		it("sends an error message when the year is too far into the feature", async () => {
			sandbox.stub(AOC, "getLeaderBoard").throws();
			sandbox.stub(command, "getYear").returns(2019);

			await command.onInteract("2021", interaction);
			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("Year requested not available.\nPlease query a year between 2015 and 2019");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("sends an error message when the year is too far in the past", async () => {
			sandbox.stub(AOC, "getLeaderBoard").throws();
			sandbox.stub(command, "getYear").returns(2018);

			await command.onInteract("2000", interaction);
			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("Year requested not available.\nPlease query a year between 2015 and 2018");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("should query the year 2018 from the AOC Service", async () => {
			const serviceMock = sandbox.stub(AOC, "getLeaderBoard").resolves({ members: {}, event: "2018", owner_id: "12345" });

			sandbox.stub(command, "getYear").returns(2020);

			await command.onInteract("2018", interaction);

			expect(serviceMock.calledOnce).to.be.true;
			expect(serviceMock.getCall(0).args[1]).to.equal(2018);
			expect(replyStub.calledOnce).to.be.true;
		});

		it("sends a message with the current score", async () => {
			sandbox.stub(AOC, "getLeaderBoard").resolves(AOCMockData);
			sandbox.stub(command, "getYear").returns(2019);

			await command.onInteract(undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Advent Of Code");
			expect(embed.description).to.equal(`Leaderboard ID: \`${ADVENT_OF_CODE_INVITE}\`\n\n[View Leaderboard](https://adventofcode.com/2019/leaderboard/private/view/${ADVENT_OF_CODE_LEADERBOARD})`);
			expect(embed.fields[0].name).to.equal(`Top ${ADVENT_OF_CODE_RESULTS_PER_PAGE}`);
			expect(embed.fields[0].value).to.equal("```java\n(Name, Stars, Points)\n 1) Lambo | 3 | 26\n```");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		it("gives an error when the wrong acces token/id is provided", async () => {
			sandbox.stub(AOC, "getLeaderBoard").throws();

			await command.onInteract(undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("Could not get the leaderboard for Advent Of Code.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("gives back one user when giving a username argument", async () => {
			sandbox.stub(AOC, "getLeaderBoard").resolves(AOCMockData);
			sandbox.stub(command, "getYear").returns(2021);

			await command.onInteract("Lambo", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Advent Of Code");
			expect(embed.description).to.equal(`Leaderboard ID: \`${ADVENT_OF_CODE_INVITE}\`\n\n[View Leaderboard](https://adventofcode.com/2021/leaderboard/private/view/${ADVENT_OF_CODE_LEADERBOARD})`);
			expect(embed.fields[0].name).to.equal("Scores of Lambo");
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

			await command.onInteract("Bob", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("Could not get the user requested\nPlease make sure you typed the name correctly");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("requesting a different year then current", async () => {
			const APIMock = sandbox.stub(AOC, "getLeaderBoard").resolves(AOCMockData);

			sandbox.stub(command, "getYear").returns(2020);

			await command.onInteract("2019", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(APIMock.getCall(0).args[1]).to.equal(2019);
			expect(embed.title).to.equal("Advent Of Code");
			expect(embed.description).to.equal(`Leaderboard ID: \`${ADVENT_OF_CODE_INVITE}\`\n\n[View Leaderboard](https://adventofcode.com/2019/leaderboard/private/view/${ADVENT_OF_CODE_LEADERBOARD})`);
			expect(embed.fields[0].name).to.equal(`Top ${ADVENT_OF_CODE_RESULTS_PER_PAGE}`);
			expect(embed.fields[0].value).to.equal("```java\n(Name, Stars, Points)\n 1) Lambo | 3 | 26\n```");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe("getYear()", () => {
		let sandbox: SinonSandbox;
		let command: AdventofcodeCommand;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new AdventofcodeCommand();
		});

		it("should give previous year if date is before November", () => {
			const date = new Date();

			date.setFullYear(2020);
			date.setMonth(7);
			date.setDate(20);
			sandbox.useFakeTimers(date);

			const year = command.getYear();

			expect(year).to.equal(2019);
		});

		it("should give current year if month is November (the same month)", () => {
			const date = new Date();

			date.setFullYear(2021);
			date.setMonth(10);
			date.setDate(13);
			sandbox.useFakeTimers(date);

			const year = command.getYear();

			expect(year).to.equal(2021);
		});

		it("should give the current year if the month is (greater month)", () => {
			const date = new Date();

			date.setFullYear(2018);
			date.setMonth(11);
			date.setDate(25);
			sandbox.useFakeTimers(date);

			const year = command.getYear();

			expect(year).to.equal(2018);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
