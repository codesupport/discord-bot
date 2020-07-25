import { expect } from "chai";
import { Constants } from "discord.js";
import RaidDetectionHandler from "../../../src/event/handlers/RaidDetectionHandler";
import { SinonSandbox, createSandbox } from "sinon";
import MockDiscord from "../../MockDiscord";
import { RAID_SETTINGS, MODS_CHANNEL_ID } from "../../../src/config.json";

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

		it("removes member from joinQueue", done => {
			const mockGuildMember = discordMock.getGuildMember();

			handler.handle(mockGuildMember).then(() => {
				expect(handler.joinQueue.includes(mockGuildMember)).to.be.true;
				setTimeout(() => {
					expect(handler.joinQueue.includes(mockGuildMember)).to.be.false;
					done();
				}, 1000 + RAID_SETTINGS.TIME_TILL_REMOVAL * 1000);
			});
		}).timeout(1000 * RAID_SETTINGS.TIME_TILL_REMOVAL + 5000);

		it("sends message to mods channel when raid is detected", async () => {
			const mockMember = discordMock.getGuildMember();
			const mockModChannel = discordMock.getTextChannel();

			mockModChannel.id = MODS_CHANNEL_ID;
			sandbox.stub(mockMember.guild.channels.cache, "find").returns(mockModChannel);
			const messageMock = sandbox.stub(mockModChannel, "send");

			for (let i = 0; i < RAID_SETTINGS.MAX_QUEUE_SIZE; i++) {
				await handler.handle(discordMock.getGuildMember(true));
			}

			await handler.handle(mockMember);
			expect(messageMock.calledOnce).to.be.true;
		});
	});
});
