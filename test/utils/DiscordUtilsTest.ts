import { expect } from "chai";
import { Message } from "discord.js";
import DiscordUtils from "../../src/utils/DiscordUtils";
import MockDiscord from "../MockDiscord";

describe("DiscordUtils", () => {
	describe("::wasSentByABot()", () => {
		let message: Message;
		let discordMock: MockDiscord;

		beforeEach(() => {
			discordMock = new MockDiscord();
			message = discordMock.getMessage();
		});

		it("should return true if message's author is a bot", () => {
			message.author.bot = true;

			expect(DiscordUtils.wasSentByABot(message)).to.be.true;
		});

		it("should return false if message's author isn't a bot", () => {
			message.author.bot = false;

			expect(DiscordUtils.wasSentByABot(message)).to.be.false;
		});
	});
});