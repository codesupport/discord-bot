import { expect } from "chai";
import { Events } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";
import { BaseMocks, CustomMocks } from "@lambocreeper/mock-discord.js";

import { RAID_SETTINGS, MOD_CHANNEL_ID } from "../../../src/config.json";
import * as getConfigValue from "../../../src/utils/getConfigValue";
import RaidDetectionHandler from "../../../src/event/handlers/RaidDetectionHandler";

describe("RaidDetectionHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for guildMemberAdd", () => {
			const handler = new RaidDetectionHandler();

			expect(handler.getEvent()).to.equal(Events.GuildMemberAdd);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: RaidDetectionHandler;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new RaidDetectionHandler();
		});

		it("adds a member to the joinQueue", async () => {
			const mockGuildMember = BaseMocks.getGuildMember();

			await handler.handle(mockGuildMember);

			expect(handler.joinQueue.includes(mockGuildMember)).to.be.true;
		});

		it("removes member from joinQueue", done => {
			const mockGuildMember = BaseMocks.getGuildMember();

			sandbox.stub(getConfigValue, "default").returns(0.002);

			handler.handle(mockGuildMember).then(() => {
				expect(handler.joinQueue.includes(mockGuildMember)).to.be.true;

				setTimeout(() => {
					expect(handler.joinQueue.includes(mockGuildMember)).to.be.false;

					done();
				}, 10);
			});
		}).timeout(200);

		it("sends message to mods channel when raid is detected and kicks user", async () => {
			const mockMember = BaseMocks.getGuildMember();
			const mockModChannel = BaseMocks.getTextChannel();

			mockModChannel.id = MOD_CHANNEL_ID;
			sandbox.stub(mockMember.guild.channels.cache, "find").returns(mockModChannel);

			const messageMock = sandbox.stub(mockModChannel, "send");
			const kickMocks = [];

			for (let i = 0; i < RAID_SETTINGS.MAX_QUEUE_SIZE; i++) {
				const member = CustomMocks.getGuildMember();

				kickMocks.push(sandbox.stub(member, "kick"));

				await handler.handle(member);
			}

			await handler.handle(mockMember);

			expect(kickMocks.map(mock => mock.called)).not.to.contain(false);
			expect(messageMock.called).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
