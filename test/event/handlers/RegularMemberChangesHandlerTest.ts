import { expect } from "chai";
import {
	Collection,
	Events,
	GuildMember,
	Role
} from "discord.js";
import { createSandbox, SinonSandbox } from "sinon";
import { BaseMocks, CustomMocks } from "@lambocreeper/mock-discord.js";
import RegularMemberChangesHandler from "../../../src/event/handlers/RegularMemberChangesHandler";
import EventHandler from "../../../src/abstracts/EventHandler";

describe("RegularMemberChangesHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for GuildMemberUpdate", () => {
			const handler = new RegularMemberChangesHandler();

			expect(handler.getEvent()).to.equal(Events.GuildMemberUpdate);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: EventHandler;
		let oldMember: GuildMember;
		let newMember: GuildMember;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new RegularMemberChangesHandler();
			oldMember = BaseMocks.getGuildMember();
			newMember = CustomMocks.getGuildMember();
		});

		afterEach(() => sandbox.restore());

		it("does nothing if the user's roles have not changed", async () => {
			const getChannelSpy = sandbox.spy(newMember.guild.channels, "fetch");

			sandbox.stub(oldMember, "roles").get(() => ({
				cache: new Collection()
			}));

			sandbox.stub(newMember, "roles").get(() => ({
				cache: new Collection()
			}));

			await handler.handle(oldMember, newMember);

			expect(getChannelSpy.called).to.be.false;
		});

		it("sends a message saying the user has the role, if they now have it", async () => {
			const channel = BaseMocks.getTextChannel();
			const sendMessageSpy = sandbox.stub(channel, "send").resolves();

			// @ts-ignore
			const getChannelSpy = sandbox.stub(newMember.guild.channels, "fetch").resolves(channel);

			sandbox.stub(oldMember, "roles").get(() => ({
				cache: new Collection()
			}));

			sandbox.stub(newMember, "roles").get(() => ({
				cache: new Collection([
					[
						"700614448846733402",
						Reflect.construct(Role,
							[
								BaseMocks.getClient(),
								{
									id: "700614448846733402",
									name: "Regular"
								},
								BaseMocks.getGuild()
							]
						)
					]
				])
			}));

			await handler.handle(oldMember, newMember);

			expect(getChannelSpy.called).to.be.true;
			expect(sendMessageSpy.called).to.be.true;

			const embed = sendMessageSpy.getCall(0).firstArg.embeds[0];

			expect(embed.data.title).to.equal("New Regular Member");
			expect(embed.data.color).to.equal(7139086);
			expect(embed.data.thumbnail.url).to.equal(newMember.user.avatarURL());
			expect(embed.data.description).to.equal(`<@${newMember.user.id}>`);
		});

		it("sends a message saying the user does not have the role, if they no longer have it", async () => {
			const channel = BaseMocks.getTextChannel();
			const sendMessageSpy = sandbox.stub(channel, "send").resolves();

			// @ts-ignore
			const getChannelSpy = sandbox.stub(newMember.guild.channels, "fetch").resolves(channel);

			sandbox.stub(oldMember, "roles").get(() => ({
				cache: new Collection([
					[
						"700614448846733402",
						Reflect.construct(Role,
							[
								BaseMocks.getClient(),
								{
									id: "700614448846733402",
									name: "Regular"
								},
								BaseMocks.getGuild()
							]
						)
					]
				])
			}));

			sandbox.stub(newMember, "roles").get(() => ({
				cache: new Collection()
			}));

			await handler.handle(oldMember, newMember);

			expect(getChannelSpy.called).to.be.true;
			expect(sendMessageSpy.called).to.be.true;

			const embed = sendMessageSpy.getCall(0).firstArg.embeds[0];

			expect(embed.data.title).to.equal("No Longer Regular");
			expect(embed.data.color).to.equal(16192275);
			expect(embed.data.thumbnail.url).to.equal(newMember.user.avatarURL());
			expect(embed.data.description).to.equal(`<@${newMember.user.id}>`);
		});
	});
});
