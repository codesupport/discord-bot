import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { Collection, EmbedField, GuildMember, GuildMemberRoleManager, Role } from "discord.js";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

import InspectCommand from "../../../src/commands/slash/InspectCommand";
import DateUtils from "../../../src/utils/DateUtils";
import DiscordUtils from "../../../src/utils/DiscordUtils";

const roleCollection = new Collection([["12345", new Role(BaseMocks.getClient(), {
	"id": "12345",
	"name": "TestRole",
	"permissions": 1
}, BaseMocks.getGuild())], [BaseMocks.getGuild().id, new Role(BaseMocks.getClient(), {
	"id": BaseMocks.getGuild().id,
	"name": "@everyone",
	"permissions": 1
}, BaseMocks.getGuild())]]);

describe("InspectCommand", () => {
	describe("onInteract()", () => {
		let sandbox: SinonSandbox;
		let command: InspectCommand;
		let interaction: any;
		let replyStub: sinon.SinonStub<any[], any>;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new InspectCommand();
			replyStub = sandbox.stub().resolves();
			interaction = {
				reply: replyStub,
				member: BaseMocks.getGuildMember()
			};
		});

		it("sends a message to the channel", async () => {
			await command.onInteract("123", interaction);

			expect(replyStub.calledOnce).to.be.true;
		});

		it("sends a message with information if an argument was provided", async () => {
			const member = BaseMocks.getGuildMember();

			sandbox.stub(GuildMember.prototype, "displayColor").get(() => "#ffffff");
			sandbox.stub(DiscordUtils, "getGuildMember").resolves(member);

			sandbox.stub(GuildMemberRoleManager.prototype, "cache").get(() => roleCollection);

			// @ts-ignore
			await command.onInteract("123321hehexd", interaction);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal(`Inspecting ${member.user.tag}`);
			expect(embed.fields[0].name).to.equal("User ID");
			expect(embed.fields[0].value).to.equal(member.user.id);
			expect(embed.fields[1].name).to.equal("Username");
			expect(embed.fields[1].value).to.equal(member.user.tag);
			expect(embed.fields[2].name).to.equal("Nickname");
			expect(embed.fields[2].value).to.equal("my name");
			expect(embed.fields[3].name).to.equal("Joined At");
			expect(embed.fields[3].value).to.equal(DateUtils.formatAsText(member.joinedAt!));
			expect(embed.fields[4].name).to.equal("Roles");
			expect(embed.fields[4].value).to.equal(" <@&12345>");
			expect(embed.hexColor).to.equal(member.displayColor);
		});

		it("sends a message with information if no argument was provided", async () => {
			const member = BaseMocks.getGuildMember();

			sandbox.stub(GuildMember.prototype, "displayColor").get(() => "#ffffff");
			sandbox.stub(DiscordUtils, "getGuildMember").resolves(member);

			sandbox.stub(GuildMemberRoleManager.prototype, "cache").get(() => roleCollection);

			// @ts-ignore
			await command.onInteract(undefined, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal(`Inspecting ${member.user.tag}`);
			expect(embed.fields.find((field: EmbedField) => field.name === "User ID")?.value).to.equal(member.user.id);
			expect(embed.fields.find((field: EmbedField) => field.name === "Username")?.value).to.equal(member.user.tag);
			expect(embed.fields.find((field: EmbedField) => field.name === "Nickname")?.value ?? null).to.equal(member?.nickname);
			expect(embed.fields.find((field: EmbedField) => field.name === "Joined At")?.value ?? null).to.equal(DateUtils.formatAsText(member!.joinedAt!));
			expect(embed.fields.find((field: EmbedField) => field.name === "Roles")?.value).to.equal(" <@&12345>");
			expect(embed.hexColor).to.equal(member.displayColor);
		});

		it("handles role field correctly if member has no role", async () => {
			const member = BaseMocks.getGuildMember();

			sandbox.stub(GuildMember.prototype, "displayColor").get(() => "#1555b7");
			sandbox.stub(DiscordUtils, "getGuildMember").resolves(member);

			sandbox.stub(GuildMemberRoleManager.prototype, "cache").get(() => new Collection([]));

			await command.onInteract(member.user.username, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal(`Inspecting ${member.user.tag}`);
			expect(embed.fields[0].name).to.equal("User ID");
			expect(embed.fields[0].value).to.equal(member.user.id);
			expect(embed.fields[1].name).to.equal("Username");
			expect(embed.fields[1].value).to.equal(member.user.tag);
			expect(embed.fields[2].name).to.equal("Nickname");
			expect(embed.fields[2].value).to.equal("my name");
			expect(embed.fields[3].name).to.equal("Joined At");
			expect(embed.fields[3].value).to.equal(DateUtils.formatAsText(member.joinedAt!));
			expect(embed.fields[4].name).to.equal("Roles");
			expect(embed.fields[4].value).to.equal("No roles");
			expect(embed.hexColor).to.equal("#1555b7");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});