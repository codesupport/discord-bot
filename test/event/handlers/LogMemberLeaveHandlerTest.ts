import { expect } from "chai";
import { Collection, Constants, GuildAuditLogs, GuildMemberRoleManager, Role, TextChannel } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";
import { BaseMocks, CustomMocks } from "@lambocreeper/mock-discord.js";
import { MEMBER_ROLE, LOG_CHANNEL_ID } from "../../../src/config.json";

import EventHandler from "../../../src/abstracts/EventHandler";
import LogMemberLeaveHandler from "../../../src/event/handlers/LogMemberLeaveHandler";
import DateUtils from "../../../src/utils/DateUtils";

describe("LogMemberLeaveHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for GUILD_MEMBER_REMOVE)", () => {
			const handler = new LogMemberLeaveHandler();

			expect(handler.getEvent()).to.equal(Constants.Events.GUILD_MEMBER_REMOVE);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: EventHandler;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new LogMemberLeaveHandler();
		});

		it("sends a message in logs channel when a member leaves", async () => {
			const message = CustomMocks.getMessage();

			sandbox.stub(message.guild!.channels.cache, "find").returns(message.channel as TextChannel);
			const messageMock = sandbox.stub(message.channel, "send");

			const guildMember = CustomMocks.getGuildMember({ joined_at: 1610478967732 });

			const roleCollection = new Collection([["12345", new Role(BaseMocks.getClient(), {
				"id": MEMBER_ROLE.toString(),
				"name": "member"
			}, BaseMocks.getGuild())], [BaseMocks.getGuild().id, new Role(BaseMocks.getClient(), {
				"id": BaseMocks.getGuild().id,
				"name": "@everyone"
			}, BaseMocks.getGuild())]]);

			sandbox.stub(DateUtils, "getFormattedTimeSinceDate").resolves("10 seconds");
			sandbox.stub(GuildMemberRoleManager.prototype, "cache").get(() => roleCollection);

			await handler.handle(guildMember);

			expect(messageMock.calledOnce).to.be.true;
			expect(messageMock.firstCall.firstArg.embed.description).to.equal("User: my-username#1234 (010101010101010101)");
		});

		it.only("does not send a message when a user is kicked part of a raid", async () => {
			const message = CustomMocks.getMessage();
			const guildMember = CustomMocks.getGuildMember({ joined_at: 1610478967732 });
			const logs = new GuildAuditLogs(CustomMocks.getGuild(), {
				audit_log_entries: [{
					action_type: GuildAuditLogs.Actions.MEMBER_KICK,
					reason: "Detected as part of a raid.",
					target_id: guildMember.id
				}]
			});

			sandbox.stub(message.guild, "fetchAuditLogs").resolves(logs);
			const channelMock = sandbox.stub(message.guild!.channels.cache, "find").returns(message.channel as TextChannel);
			const messageMock = sandbox.stub(message.channel, "send");

			await handler.handle(guildMember);

			expect(messageMock.called).to.be.false;
			expect(channelMock.called).to.be.false;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});

