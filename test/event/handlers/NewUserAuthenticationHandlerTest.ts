import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import { Constants, MessageReaction, User } from "discord.js";
import NewUserAuthenticationHandler from "../../../src/event/handlers/NewUserAuthenticationHandler";
import EventHandler from "../../../src/abstracts/EventHandler";
// @ts-ignore
import MockDiscord from "../../MockDiscord";

describe("NewUserAuthenticationHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for MESSAGE_REACTION_ADD", () => {
			const handler = new NewUserAuthenticationHandler();

			expect(handler.getEvent()).to.equal(Constants.Events.MESSAGE_REACTION_ADD);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: EventHandler;
		let discordMock: MockDiscord;
		let reaction: MessageReaction;
		let user: User;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new NewUserAuthenticationHandler();
			discordMock = new MockDiscord();
			reaction = discordMock.getMessageReaction();
			user = discordMock.getUser();
		});

		it("gives the user the member role if they meet the requirements", async () => {
			reaction.message.id = "592316062796873738";
			reaction.emoji.name = "🤖";

			// @ts-ignore
			const fetchMock = sandbox.stub(reaction.message.guild?.members, "fetch").resolves({
				roles: {
					add: async (role: string, reason: string) => [role, reason]
				}
			});

			await handler.handle(reaction, user);

			expect(fetchMock.calledOnce).to.be.true;
		});

		it("does not give the user the member role if they react with the wrong emoji", async () => {
			reaction.message.id = "592316062796873738";
			reaction.emoji.name = "😀";

			// @ts-ignore
			const fetchMock = sandbox.stub(reaction.message.guild?.members, "fetch").resolves({
				roles: {
					add: async (role: string, reason: string) => [role, reason]
				}
			});

			await handler.handle(reaction, user);

			expect(fetchMock.calledOnce).to.be.false;
		});

		it("does not give the user the member role if they react to the wrong message", async () => {
			reaction.message.id = "1234";
			reaction.emoji.name = "🤖";

			// @ts-ignore
			const fetchMock = sandbox.stub(reaction.message.guild?.members, "fetch").resolves({
				roles: {
					add: async (role: string, reason: string) => [role, reason]
				}
			});

			await handler.handle(reaction, user);

			expect(fetchMock.calledOnce).to.be.false;
		});

		it("does not give the user the member role if they react to the wrong message with the wrong emoji", async () => {
			reaction.message.id = "1234";
			reaction.emoji.name = "😀";

			// @ts-ignore
			const fetchMock = sandbox.stub(reaction.message.guild?.members, "fetch").resolves({
				roles: {
					add: async (role: string, reason: string) => [role, reason]
				}
			});

			await handler.handle(reaction, user);

			expect(fetchMock.calledOnce).to.be.false;
		});

		afterEach(() => {
			sandbox.reset();
		});
	});
});