import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import DiscordUtils from "../../src/utils/DiscordUtils";
import { BaseMocks, CustomMocks } from "@lambocreeper/mock-discord.js";
import { Collection, GuildMemberManager } from "discord.js";

const user = CustomMocks.getUser({id: "123456789", username: "fakeUser", discriminator: "1234"});
const member = CustomMocks.getGuildMember({user: user});

describe("DiscordUtils", () => {
	describe("::getGuildMember()", () => {
		let sandbox: SinonSandbox;

		beforeEach(() => {
			sandbox = createSandbox();
		});

		it("returns GuildMember if value is a username + discriminator", async () => {
			sandbox.stub(GuildMemberManager.prototype, "fetch").resolves(new Collection([["12345", member]]));

			expect(await DiscordUtils.getGuildMember("fakeUser#1234", BaseMocks.getGuild())).to.equal(member);
		});

		it("returns GuildMember if value is a username", async () => {
			sandbox.stub(GuildMemberManager.prototype, "fetch").resolves(new Collection([["12345", member]]));

			expect(await DiscordUtils.getGuildMember("fakeUser", BaseMocks.getGuild())).to.equal(member);
		});

		it("returns GuildMember if value is a userID", async () => {
			// @ts-ignore (the types aren't recognising the overloaded fetch function)
			sandbox.stub(GuildMemberManager.prototype, "fetch").resolves(member);

			expect(await DiscordUtils.getGuildMember("123456789", BaseMocks.getGuild())).to.equal(member);
		});

		it("returns GuildMember if value is a nickname", async () => {
			const nicknameMember = CustomMocks.getGuildMember({nick: "Lambo", user: user});

			sandbox.stub(GuildMemberManager.prototype, "fetch").resolves(new Collection([["12345", nicknameMember]]));

			expect(await DiscordUtils.getGuildMember("Lambo", BaseMocks.getGuild())).to.equal(nicknameMember);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
