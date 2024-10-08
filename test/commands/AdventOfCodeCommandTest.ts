import { createSandbox, SinonSandbox, SinonStubbedInstance } from "sinon";
import { expect } from "chai";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

import AdventOfCodeCommand from "../../src/commands/AdventOfCodeCommand";
import AdventOfCodeService from "../../src/services/AdventOfCodeService";
import { EMBED_COLOURS, ADVENT_OF_CODE_INVITE, ADVENT_OF_CODE_LEADERBOARD, ADVENT_OF_CODE_RESULTS_PER_PAGE } from "../../src/config.json";
import { AOCMember } from "../../src/interfaces/AdventOfCode";
import NumberUtils from "../../src/utils/NumberUtils";

const AOCMockData: AOCMember[] = [{
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
}];

describe("AdventOfCodeCommand", () => {
	describe("onInteract()", () => {
		let sandbox: SinonSandbox;
		let command: AdventOfCodeCommand;
		let AOC: SinonStubbedInstance<AdventOfCodeService>;
		let interaction: any;
		let replyStub: sinon.SinonStub<any[], any>;

		beforeEach(() => {
			sandbox = createSandbox();
			AOC = sandbox.createStubInstance(AdventOfCodeService);
			command = new AdventOfCodeCommand(AOC);
			replyStub = sandbox.stub().resolves();
			interaction = {
				reply: replyStub,
				user: BaseMocks.getGuildMember()
			};
		});

		it("sends a message to the channel", async () => {
			await command.onInteract(2021, "Lambo", interaction);

			expect(replyStub.calledOnce).to.be.true;
		});

		it("sends an error message when the year is too far into the feature", async () => {
			AOC.getSortedPlayerList.throws();
			sandbox.stub(command, "getYear").returns(2019);

			await command.onInteract(2021, undefined, interaction);
			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Error");
			expect(embed.data.description).to.equal("Year requested not available.\nPlease query a year between 2015 and 2019");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.ERROR.toLowerCase()));
			expect(replyStub.getCall(0).firstArg.ephemeral).to.be.true;
		});

		it("should query the year 2018 from the AOC Service", async () => {
			const serviceMock = AOC.getSortedPlayerList.resolves([]);

			sandbox.stub(command, "getYear").returns(2020);

			await command.onInteract(2018, undefined, interaction);

			expect(serviceMock.calledOnce).to.be.true;
			expect(serviceMock.getCall(0).args[1]).to.equal(2018);
			expect(replyStub.calledOnce).to.be.true;
		});

		it("sends a message with the current score", async () => {
			AOC.getSortedPlayerList.resolves(AOCMockData);
			sandbox.stub(command, "getYear").returns(2019);

			await command.onInteract(undefined, undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];
			const button = replyStub.getCall(0).firstArg.components[0].components[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Advent Of Code");
			expect(embed.data.description).to.equal(`Invite Code: \`${ADVENT_OF_CODE_INVITE}\``);
			expect(embed.data.fields[0].name).to.equal(`Top ${ADVENT_OF_CODE_RESULTS_PER_PAGE} in 2019`);
			expect(embed.data.fields[0].value).to.equal("```java\n(Name, Stars, Points)\n 1) Lambo | 3 | 26\n```");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.SUCCESS.toLowerCase()));
			expect(button.data.url).to.equal(`https://adventofcode.com/2019/leaderboard/private/view/${ADVENT_OF_CODE_LEADERBOARD}`);
			expect(button.data.label).to.equal("View Leaderboard");
		});

		it("gives an error when the wrong acces token/id is provided", async () => {
			AOC.getSortedPlayerList.throws();

			await command.onInteract(undefined, undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Error");
			expect(embed.data.description).to.equal("Could not get the leaderboard for Advent Of Code.");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.ERROR.toLowerCase()));
			expect(replyStub.getCall(0).firstArg.ephemeral).to.be.true;
		});

		it("gives back one user when giving a username argument", async () => {
			AOC.getSortedPlayerList.resolves(AOCMockData);
			AOC.getSinglePlayer.resolves([1, AOCMockData[0]]);

			sandbox.stub(command, "getYear").returns(2021);

			await command.onInteract(undefined, "Lambo", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];
			const button = replyStub.getCall(0).firstArg.components[0].components[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Advent Of Code");
			expect(embed.data.description).to.equal(`Invite Code: \`${ADVENT_OF_CODE_INVITE}\``);
			expect(embed.data.fields[0].name).to.equal("Scores of Lambo in 2021");
			expect(embed.data.fields[0].value).to.equal("\u200B");
			expect(embed.data.fields[1].name).to.equal("Position");
			expect(embed.data.fields[1].value).to.equal("1");
			expect(embed.data.fields[2].name).to.equal("Stars");
			expect(embed.data.fields[2].value).to.equal("3");
			expect(embed.data.fields[3].name).to.equal("Points");
			expect(embed.data.fields[3].value).to.equal("26");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.SUCCESS.toLowerCase()));
			expect(button.data.url).to.equal(`https://adventofcode.com/2021/leaderboard/private/view/${ADVENT_OF_CODE_LEADERBOARD}`);
			expect(button.data.label).to.equal("View Leaderboard");
		});

		it("should give an error when the user doesn't exist", async () => {
			AOC.getSortedPlayerList.resolves(AOCMockData);

			await command.onInteract(undefined, "Bob", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Error");
			expect(embed.data.description).to.equal("Could not get the user requested\nPlease make sure you typed the name correctly");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.ERROR.toLowerCase()));
			expect(replyStub.getCall(0).firstArg.ephemeral).to.be.true;
		});

		it("requesting a different year than current", async () => {
			const APIMock = AOC.getSortedPlayerList.resolves(AOCMockData);

			sandbox.stub(command, "getYear").returns(2020);

			await command.onInteract(2019, undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];
			const button = replyStub.getCall(0).firstArg.components[0].components[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(APIMock.getCall(0).args[1]).to.equal(2019);
			expect(embed.data.title).to.equal("Advent Of Code");
			expect(embed.data.description).to.equal(`Invite Code: \`${ADVENT_OF_CODE_INVITE}\``);
			expect(embed.data.fields[0].name).to.equal(`Top ${ADVENT_OF_CODE_RESULTS_PER_PAGE} in 2019`);
			expect(embed.data.fields[0].value).to.equal("```java\n(Name, Stars, Points)\n 1) Lambo | 3 | 26\n```");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.SUCCESS.toLowerCase()));
			expect(button.data.url).to.equal(`https://adventofcode.com/2019/leaderboard/private/view/${ADVENT_OF_CODE_LEADERBOARD}`);
			expect(button.data.label).to.equal("View Leaderboard");
		});

		it("gives back user from requested year", async () => {
			AOC.getSinglePlayer.resolves([1, AOCMockData[0]]);

			sandbox.stub(command, "getYear").returns(2021);

			await command.onInteract(2018, "Lambo", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];
			const button = replyStub.getCall(0).firstArg.components[0].components[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(AOC.getSinglePlayer.getCall(0).args[1]).to.equal(2018);
			expect(embed.data.title).to.equal("Advent Of Code");
			expect(embed.data.description).to.equal(`Invite Code: \`${ADVENT_OF_CODE_INVITE}\``);
			expect(embed.data.fields[0].name).to.equal("Scores of Lambo in 2018");
			expect(embed.data.fields[0].value).to.equal("\u200B");
			expect(embed.data.fields[1].name).to.equal("Position");
			expect(embed.data.fields[1].value).to.equal("1");
			expect(embed.data.fields[2].name).to.equal("Stars");
			expect(embed.data.fields[2].value).to.equal("3");
			expect(embed.data.fields[3].name).to.equal("Points");
			expect(embed.data.fields[3].value).to.equal("26");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.SUCCESS.toLowerCase()));
			expect(button.data.url).to.equal(`https://adventofcode.com/2018/leaderboard/private/view/${ADVENT_OF_CODE_LEADERBOARD}`);
			expect(button.data.label).to.equal("View Leaderboard");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
