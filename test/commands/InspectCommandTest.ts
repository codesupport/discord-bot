import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { Collection, EmbedField, GuildMember, GuildMemberRoleManager, Role, time, TimestampStyles } from "discord.js";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

import InspectCommand from "../../src/commands/InspectCommand";
import DiscordUtils from "../../src/utils/DiscordUtils";
import NumberUtils from "../../src/utils/NumberUtils";

const roleCollection = new Collection([
	[
		"12345",
		Reflect.construct(Role,
			[
				BaseMocks.getClient(),
				{
					"id": "12345",
					"name": "TestRole",
					"permissions": 1
				},
				BaseMocks.getGuild()
			])
	],
	[
		BaseMocks.getGuild().id,
		Reflect.construct(Role,
			[
				BaseMocks.getClient(),
				{
					"id": BaseMocks.getGuild().id,
					"name": "@everyone",
					"permissions": 1
				},
				BaseMocks.getGuild()
			])
	]
]);

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
				user: BaseMocks.getGuildMember()
			};
		});

		it("sends a message to the channel", async () => {
			await command.onInteract(BaseMocks.getGuildMember(), interaction);

			expect(replyStub.calledOnce).to.be.true;
		});

		it("sends a message with information if an argument was provided", async () => {
			const member = BaseMocks.getGuildMember();

			sandbox.stub(member, "displayColor").get(() => NumberUtils.hexadecimalToInteger("#ffffff"));
			sandbox.stub(DiscordUtils, "getGuildMember").resolves(member);
			sandbox.stub(member, "roles").get(() => ({ cache: roleCollection }));

			// @ts-ignore
			await command.onInteract(member, interaction);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = replyStub.getCall(0).firstArg.embeds[0];
			const shortDateTime = time(member?.joinedAt!, TimestampStyles.ShortDateTime);
			const relativeTime = time(member?.joinedAt!, TimestampStyles.RelativeTime);

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal(`Inspecting ${member.user.username}`);
			expect(embed.data.fields[0].name).to.equal("User ID");
			expect(embed.data.fields[0].value).to.equal(member.user.id);
			expect(embed.data.fields[1].name).to.equal("Username");
			expect(embed.data.fields[1].value).to.equal(member.user.username);
			expect(embed.data.fields[2].name).to.equal("Nickname");
			expect(embed.data.fields[2].value).to.equal("my name");
			expect(embed.data.fields[3].name).to.equal("Joined At");
			expect(embed.data.fields[3].value).to.equal(`${shortDateTime} ${relativeTime}`);
			expect(embed.data.fields[4].name).to.equal("Roles");
			expect(embed.data.fields[4].value).to.equal(" <@&12345>");
			expect(embed.data.color).to.equal(member.displayColor);
		});

		it("sends a message with information if no argument was provided", async () => {
			const member = BaseMocks.getGuildMember();

			sandbox.stub(member, "displayColor").get(() => NumberUtils.hexadecimalToInteger("#ffffff"));
			sandbox.stub(DiscordUtils, "getGuildMember").resolves(member);
			sandbox.stub(member, "roles").get(() => ({ cache: roleCollection }));

			// @ts-ignore
			await command.onInteract(member, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];
			const shortDateTime = time(member?.joinedAt!, TimestampStyles.ShortDateTime);
			const relativeTime = time(member?.joinedAt!, TimestampStyles.RelativeTime);

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal(`Inspecting ${member.user.username}`);
			expect(embed.data.fields.find((field: EmbedField) => field.name === "User ID")?.value).to.equal(member.user.id);
			expect(embed.data.fields.find((field: EmbedField) => field.name === "Username")?.value).to.equal(member.user.username);
			expect(embed.data.fields.find((field: EmbedField) => field.name === "Nickname")?.value ?? null).to.equal(member?.nickname);
			expect(embed.data.fields.find((field: EmbedField) => field.name === "Joined At")?.value ?? null).to.equal(`${shortDateTime} ${relativeTime}`);
			expect(embed.data.fields.find((field: EmbedField) => field.name === "Roles")?.value).to.equal(" <@&12345>");
			expect(embed.data.color).to.equal(member.displayColor);
		});

		it("handles role field correctly if member has no role", async () => {
			const member = BaseMocks.getGuildMember();

			sandbox.stub(member, "displayColor").get(() => NumberUtils.hexadecimalToInteger("#1555b7"));
			sandbox.stub(DiscordUtils, "getGuildMember").resolves(member);
			sandbox.stub(member, "roles").get(() => ({ cache: new Collection([]) }));

			await command.onInteract(member, interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];
			const shortDateTime = time(member?.joinedAt!, TimestampStyles.ShortDateTime);
			const relativeTime = time(member?.joinedAt!, TimestampStyles.RelativeTime);

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal(`Inspecting ${member.user.username}`);
			expect(embed.data.fields[0].name).to.equal("User ID");
			expect(embed.data.fields[0].value).to.equal(member.user.id);
			expect(embed.data.fields[1].name).to.equal("Username");
			expect(embed.data.fields[1].value).to.equal(member.user.username);
			expect(embed.data.fields[2].name).to.equal("Nickname");
			expect(embed.data.fields[2].value).to.equal("my name");
			expect(embed.data.fields[3].name).to.equal("Joined At");
			expect(embed.data.fields[3].value).to.equal(`${shortDateTime} ${relativeTime}`);
			expect(embed.data.fields[4].name).to.equal("Roles");
			expect(embed.data.fields[4].value).to.equal("No roles");
			expect(embed.data.color).to.equal(member.displayColor);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
