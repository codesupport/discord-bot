import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import getMemberUtil from "../../src/utils/getMemberUtil";
import { CustomMocks } from "@lambocreeper/mock-discord.js";
import {Collection, GuildMember} from "discord.js";

describe("getMemberUtil", () => {
	describe("::getGuildMember()", () => {
		let sandbox: SinonSandbox;

		beforeEach(() => {
			sandbox = createSandbox();
		});

		it("returns GuildMember if value is a userID string", () => {
			const guild = CustomMocks.getGuild();
			const user = CustomMocks.getUser({id: "123456789", username: "fakeUser", discriminator: "12345"});

			guild.addMember(user, {accessToken: "123456789"});

			expect(getMemberUtil.getGuildMember("fakeUser#1234", guild)).to.deep.equal(GuildMember);
		});
	});
});