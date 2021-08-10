import { expect } from "chai";
import { Collection, Constants, GuildMemberRoleManager, Role } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";
import { BaseMocks, CustomMocks } from "updated-mock-discord.js";
import { MEMBER_ROLE } from "../../../src/config.json";

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
			const messageMock = sandbox.stub(message.guild!.channels.cache, "find");

			const guildMember = CustomMocks.getGuildMember({joined_at: '1610478967732'});

			const roleCollection = new Collection([["12345", new Role(BaseMocks.getClient(), {
				id: MEMBER_ROLE.toString(),
				name: "member",
				permissions: '1'
			}, BaseMocks.getGuild())], [BaseMocks.getGuild().id, new Role(BaseMocks.getClient(), {
				id: BaseMocks.getGuild().id,
				name: "@everyone",
				permissions: '1'
			}, BaseMocks.getGuild())]]);

			sandbox.stub(DateUtils, "getFormattedTimeSinceDate").resolves("10 seconds");
			sandbox.stub(GuildMemberRoleManager.prototype, "cache").get(() => roleCollection);

			await handler.handle(guildMember);

			expect(messageMock.calledOnce).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});

