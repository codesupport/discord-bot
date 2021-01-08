import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import getMemberUtil from "../../src/utils/getMemberUtil";
import {BaseMocks, CustomMocks} from "@lambocreeper/mock-discord.js";
import {Collection, GuildMember, GuildMemberManager} from "discord.js";

describe("getMemberUtil", () => {
	describe("::getGuildMember()", () => {
		let sandbox: SinonSandbox;

		beforeEach(() => {
			sandbox = createSandbox();
		});

		it("returns GuildMember if value is a userID string", async () => {
			const user = CustomMocks.getUser({id: "123456789", username: "fakeUser", discriminator: "12345"});
			const member = CustomMocks.getGuildMember({user: user});

			sandbox.stub(GuildMemberManager.prototype, "fetch").resolves(new Collection([["12345", member]]));

			expect(await getMemberUtil.getGuildMember("fakeUser#1234", BaseMocks.getGuild())).to.equal(member);
		});
	});
});