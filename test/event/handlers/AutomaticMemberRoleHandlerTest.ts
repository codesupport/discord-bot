import { expect } from "chai";
import { Constants, GuildMember } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";
import BaseMocks from "@lambocreeper/mock-discord.js/build/BaseMocks";

import AutomaticMemberRoleHandler from "../../../src/event/handlers/AutomaticMemberRoleHandler";
import EventHandler from "../../../src/abstracts/EventHandler";

describe("AutomaticMemberRoleHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for GUILD_MEMBER_ADD", () => {
			const handler = new AutomaticMemberRoleHandler();

			expect(handler.getEvent()).to.equal(Constants.Events.GUILD_MEMBER_ADD);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: EventHandler;
		let member: GuildMember;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new AutomaticMemberRoleHandler();
			member = BaseMocks.getGuildMember();
		});

		it("doesn't give the member the role if they don't have an avatar", async () => {
			member.user.avatar = null;

			const addMock = sandbox.stub(member.roles, "add");

			await handler.handle(member);

			expect(addMock.calledOnce).to.be.false;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});