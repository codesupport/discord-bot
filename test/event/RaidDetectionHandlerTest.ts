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

		it("removes member from joinQueue", async done => {
			const mockGuildMember = discordMock.getGuildMember();

			await handler.handle(mockGuildMember);

			expect(handler.joinQueue.includes(mockGuildMember)).to.be.true;
			setTimeout(() => {
				expect(handler.joinQueue.includes(mockGuildMember)).to.be.false;
				done();
			}, 1000 + RAID_SETTINGS.TIME_TILL_REMOVAL * 1000);
			// Adding an additional second just as a fail-safe.
		}).timeout(1000 * RAID_SETTINGS.TIME_TILL_REMOVAL + 5000);

		/* A it("sends message to mods channel when raid is detected", async () => {
			const mockGuildMembers = [];

			for (let i = 0; i < RAID_SETTINGS.MAX_QUEUE_SIZE + 5; i++) {
				mockGuildMembers[i] = discordMock.getGuildMember();
			}
		}); */
	});
});