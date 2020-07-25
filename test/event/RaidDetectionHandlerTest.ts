import { expect } from "chai";
import { Constants, GuildMember, TextChannel } from "discord.js";
import RaidDetectionHandler from "../../src/event/handlers/RaidDetectionHandler";
import { SinonSandbox, createSandbox } from "sinon";
import EventHandler from "../../src/abstracts/EventHandler";
import MockDiscord from "../MockDiscord";
import { RAID_SETTINGS } from "../../src/config.json";

describe("RaidDetectionHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for GUILD_MEMBER_ADD", () => {
			const handler = new RaidDetectionHandler();

			expect(handler.getEvent()).to.equal(Constants.Events.GUILD_MEMBER_ADD);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: RaidDetectionHandler;
		let discordMock: MockDiscord;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new RaidDetectionHandler();
			discordMock = new MockDiscord();
		});

		it("adds a member to the joinQueue", async () => {
			const mockGuildMember = discordMock.getGuildMember();

			await handler.handle(mockGuildMember);

			expect(handler.joinQueue.includes(mockGuildMember)).to.be.true;
		});

		it ("removes member from joinQueue", async() => {
			const mockGuildMember = discordMock.getGuildMember();

			await handler.handle(mockGuildMember);

			setTimeout(() => {
				expect(handler.joinQueue.includes(mockGuildMember)).to.be.false;
			}, 1000 + (RAID_SETTINGS.TIME_TILL_REMOVAL * 1000));
		});
	});
});