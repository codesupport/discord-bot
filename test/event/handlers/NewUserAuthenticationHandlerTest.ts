import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import { Constants, User } from "discord.js";
import { BaseMocks, CustomMocks } from "@lambocreeper/mock-discord.js";

import NewUserAuthenticationHandler from "../../../src/event/handlers/NewUserAuthenticationHandler";
import EventHandler from "../../../src/abstracts/EventHandler";

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
		let user: User;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new NewUserAuthenticationHandler();
			user = BaseMocks.getUser();
		});

		it("gives the user the member role if they meet the requirements", async () => {
			const message = CustomMocks.getMessage({
				id: "592316062796873738"
			});

			const reaction = CustomMocks.getMessageReaction({
				emoji: {
					name: "🤖"
				}
			}, { message });

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
			const message = CustomMocks.getMessage({
				id: "592316062796873738"
			});

			const reaction = CustomMocks.getMessageReaction({
				emoji: {
					name: "😀"
				}
			}, { message });

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
			const message = CustomMocks.getMessage({
				id: "1234"
			});

			const reaction = CustomMocks.getMessageReaction({
				emoji: {
					name: "🤖"
				}
			}, { message });

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
			const message = CustomMocks.getMessage({
				id: "1234"
			});

			const reaction = CustomMocks.getMessageReaction({
				emoji: {
					name: "😀"
				}
			}, { message });

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
			sandbox.restore();
		});
	});
});