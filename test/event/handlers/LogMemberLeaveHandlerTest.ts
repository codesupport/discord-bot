import { expect } from "chai";
import { Collection, Events, GuildMemberRoleManager, Role } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";
import { BaseMocks, CustomMocks } from "@lambocreeper/mock-discord.js";
import { MEMBER_ROLE } from "../../../src/config.json";

import EventHandler from "../../../src/abstracts/EventHandler";
import LogMemberLeaveHandler from "../../../src/event/handlers/LogMemberLeaveHandler";
import DateUtils from "../../../src/utils/DateUtils";

describe("LogMemberLeaveHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for guildMemberRemove", () => {
			const handler = new LogMemberLeaveHandler();

			expect(handler.getEvent()).to.equal(Events.GuildMemberRemove);
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

			const guildMember = CustomMocks.getGuildMember({joined_at: new Date(1610478967732).toISOString()});

			const roleCollection = new Collection([["12345", new Role(BaseMocks.getClient(), {
				id: MEMBER_ROLE.toString(),
				name: "member",
				permissions: "1"
			}, BaseMocks.getGuild())], [BaseMocks.getGuild().id, new Role(BaseMocks.getClient(), {
				id: BaseMocks.getGuild().id,
				name: "@everyone",
				permissions: "1"
			}, BaseMocks.getGuild())]]);

			sandbox.stub(DateUtils, "getFormattedTimeSinceDate").returns("10 seconds");
			sandbox.stub(GuildMemberRoleManager.prototype, "cache").get(() => roleCollection);

			await handler.handle(guildMember);

			expect(messageMock.calledOnce).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});

