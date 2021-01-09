import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import getMemberUtil from "../../src/utils/getMemberUtil";
import {BaseMocks, CustomMocks} from "@lambocreeper/mock-discord.js";
import {Collection, GuildMemberManager} from "discord.js";

const user = CustomMocks.getUser({id: "123456789", username: "fakeUser", discriminator: "1234"});
const member = CustomMocks.getGuildMember({user: user});

describe("getMemberUtil", () => {
	describe("::getGuildMember()", () => {
		let sandbox: SinonSandbox;

		beforeEach(() => {
			sandbox = createSandbox();
		});

		it("returns GuildMember if value is a username + discriminator", async () => {
			sandbox.stub(GuildMemberManager.prototype, "fetch").resolves(new Collection([["12345", member]]));

			expect(await getMemberUtil.getGuildMember("fakeUser#1234", BaseMocks.getGuild())).to.equal(member);
		});

		it("returns GuildMember if value is a username", async () => {
			sandbox.stub(GuildMemberManager.prototype, "fetch").resolves(new Collection([["12345", member]]));

			expect(await getMemberUtil.getGuildMember("fakeUser", BaseMocks.getGuild())).to.equal(member);
		});

		it("returns GuildMember if value is a userID", async () => {
			// @ts-ignore (the types aren't recognising the overloaded fetch function)
			sandbox.stub(GuildMemberManager.prototype, "fetch").resolves(member);

			expect(await getMemberUtil.getGuildMember("123456789", BaseMocks.getGuild())).to.equal(member);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});