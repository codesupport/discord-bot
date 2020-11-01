import { expect } from "chai";
import { Constants, Channel, Message, MessageMentions, Collection, User } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";
import BaseMocks from "@lambocreeper/mock-discord.js/build/BaseMocks";

import EventHandler from "../../../src/abstracts/EventHandler";
import GhostPingHandler from "../../../src/event/handlers/GhostPingHandler";

describe("GhostPingHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for MESSAGE_DELETE", () => {
			const handler = new GhostPingHandler();

			expect(handler.getEvent()).to.equal(Constants.Events.MESSAGE_DELETE);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: EventHandler;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new GhostPingHandler();
		});

		it("sends a message when a message is deleted that pinged a user", async () => {
			const message = BaseMocks.getMessage();
			const messageMock = sandbox.stub(message.channel, "send");

			message.mentions = new MessageMentions(message, [BaseMocks.getUser()], [], false);

			message.content = "Hey <@328194044587147278>!";

			await handler.handle(message);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("does not send a message when a message is deleted that didn't ping a user", async () => {
			const message = BaseMocks.getMessage();
			const messageMock = sandbox.stub(message.channel, "send");

			message.mentions = new MessageMentions(message, [], [], false);

			message.content = "Hey everybody!";

			await handler.handle(message);

			expect(messageMock.calledOnce).to.be.false;
		});

		it("does not send a message when it's author is a bot", async () => {
			const message = BaseMocks.getMessage();
			const messageMock = sandbox.stub(message.channel, "send");

			const author = BaseMocks.getUser();
			author.bot = true;

			message.author = author;
			message.mentions = new MessageMentions(message, [BaseMocks.getUser()], [], false);
			message.content = "Hey <@328194044587147278>, stop spamming or we'll arrest you!";

			await handler.handle(message);

			expect(messageMock.called).to.be.false;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});

