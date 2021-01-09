import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import DiscordUtil from "../../src/utils/DiscordUtil";
import {BaseMocks, CustomMocks} from "@lambocreeper/mock-discord.js";
import {Collection, GuildMemberManager} from "discord.js";

const user = CustomMocks.getUser({id: "123456789", username: "fakeUser", discriminator: "1234"});
const member = CustomMocks.getGuildMember({user: user});

describe("DiscordUtil", () => {
	describe("::getGuildMember()", () => {
		let sandbox: SinonSandbox;

		beforeEach(() => {
			sandbox = createSandbox();
		});

		it("returns GuildMember if value is a username + discriminator", async () => {
			sandbox.stub(GuildMemberManager.prototype, "fetch").resolves(new Collection([["12345", member]]));

			expect(await DiscordUtil.getGuildMember("fakeUser#1234", BaseMocks.getGuild())).to.equal(member);
		});

		it("returns GuildMember if value is a username", async () => {
			sandbox.stub(GuildMemberManager.prototype, "fetch").resolves(new Collection([["12345", member]]));

			expect(await DiscordUtil.getGuildMember("fakeUser", BaseMocks.getGuild())).to.equal(member);
		});

		it("returns GuildMember if value is a userID", async () => {
			// @ts-ignore (the types aren't recognising the overloaded fetch function)
			sandbox.stub(GuildMemberManager.prototype, "fetch").resolves(member);

			expect(await DiscordUtil.getGuildMember("123456789", BaseMocks.getGuild())).to.equal(member);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});