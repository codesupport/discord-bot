import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { Collection, EmbedField, GuildMember, GuildMemberRoleManager, Message, Role } from "discord.js";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

import InspectCommand from "../../src/commands/InspectCommand";
import Command from "../../src/abstracts/Command";
import { EMBED_COLOURS } from "../../src/config.json";
import DateUtils from "../../src/utils/DateUtils";
import getMemberUtil from "../../src/utils/getMemberUtil";

const roleCollection = new Collection([["12345", new Role(BaseMocks.getClient(), {
	"id": "12345",
	"name": "TestRole"
}, BaseMocks.getGuild())], [BaseMocks.getGuild().id, new Role(BaseMocks.getClient(), {
	"id": BaseMocks.getGuild().id,
	"name": "@everyone"
}, BaseMocks.getGuild())]]);

describe("InspectCommand", () => {
	describe("constructor()", () => {
		it("creates a command called inspect", () => {
			const command = new InspectCommand();

			expect(command.getName()).to.equal("inspect");
		});

		it("creates a command with correct description", () => {
			const command = new InspectCommand();

			expect(command.getDescription()).to.equal("Show information about a given user");
		});
	});

	describe("run()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: Command;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new InspectCommand();
			message = BaseMocks.getMessage();
		});

		it("sends a message to the channel", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["User"]);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("sends an error message when user is not found", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(getMemberUtil, "getGuildMember").resolves(undefined);

			await command.run(message, ["FakeUser#1234"]);

			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("No match found.");
			expect(embed.fields[0].name).to.equal("Correct Usage");
			expect(embed.fields[0].value).to.equal("?inspect [username|userID]");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("sends a message with information if an argument was provided", async () => {
			const messageMock = sandbox.stub(message.channel, "send");
			const member = BaseMocks.getGuildMember();

			sandbox.stub(GuildMember.prototype, "displayColor").get(() => "#ffffff");
			sandbox.stub(getMemberUtil, "getGuildMember").resolves(member);

			sandbox.stub(GuildMemberRoleManager.prototype, "cache").get(() => roleCollection);

			await command.run(message, ["010101010101010101"]);

			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal(`Inspecting ${member.user.username}#${member.user.discriminator}`);
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
			const messageMock = sandbox.stub(message.channel, "send");
			const member = BaseMocks.getGuildMember();

			sandbox.stub(GuildMember.prototype, "displayColor").get(() => "#ffffff");
			sandbox.stub(GuildMemberRoleManager.prototype, "cache").get(() => roleCollection);

			await command.run(message, []);

			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;

			expect(embed.title).to.equal(`Inspecting ${member.user.username}#${member.user.discriminator}`);
			expect(embed.fields.find((field: EmbedField) => field.name === "User ID")?.value).to.equal(member.user.id);
			expect(embed.fields.find((field: EmbedField) => field.name === "Username")?.value).to.equal(member.user.tag);
			expect(embed.fields.find((field: EmbedField) => field.name === "Nickname")?.value ?? null).to.equal(message.member?.nickname);
			expect(embed.fields.find((field: EmbedField) => field.name === "Joined At")?.value ?? null).to.equal(message.member?.joinedAt);
			expect(embed.fields.find((field: EmbedField) => field.name === "Roles")?.value).to.equal(" <@&12345>");
			expect(embed.hexColor).to.equal(member.displayColor);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});