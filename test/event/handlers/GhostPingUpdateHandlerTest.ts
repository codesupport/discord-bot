import { expect } from "chai";
import { Collection, Constants, Guild, Message, MessageEmbed, MessageMentions } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";
import { BaseMocks, CustomMocks } from "@lambocreeper/mock-discord.js";

import EventHandler from "../../../src/abstracts/EventHandler";
import GhostPingUpdateHandler from "../../../src/event/handlers/GhostPingUpdateHandler";

describe("GhostPingUpdateHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for MESSAGE_UPDATE", () => {
			const handler = new GhostPingUpdateHandler();

			expect(handler.getEvent()).to.equal(Constants.Events.MESSAGE_UPDATE);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: EventHandler;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new GhostPingUpdateHandler();
		});

		it("sends a message when a message is edited where a pinged user was removed", async () => {
			const oldMessage = CustomMocks.getMessage();
			const newMessage = CustomMocks.getMessage();
			const messageMock = sandbox.stub(oldMessage.channel, "send");

			oldMessage.mentions = new MessageMentions(oldMessage, [CustomMocks.getUser({ id: "328194044587147278" })], [], false);
			oldMessage.content = "Hey <@328194044587147278>!";

			newMessage.mentions = new MessageMentions(newMessage, [], [], false);
			newMessage.content = "Hey!";

			await handler.handle(oldMessage, newMessage);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("sends a message when message author removes a mention that isn't themself", async () => {
			const oldMessage = CustomMocks.getMessage();
			const newMessage = CustomMocks.getMessage();
			const messageMock = sandbox.stub(oldMessage.channel, "send");

			const author = CustomMocks.getUser({ id: "328194044587147279" });

			oldMessage.author = author;
			oldMessage.mentions = new MessageMentions(oldMessage, [author, CustomMocks.getUser({ id: "328194044587147278" })], [], false);
			oldMessage.content = `<@${oldMessage.author.id}> <@328194044587147278>`;

			newMessage.author = author;
			newMessage.mentions = new MessageMentions(newMessage, [author], [], false);
			newMessage.content = `<@${newMessage.author.id}>`;

			await handler.handle(oldMessage, newMessage);

			expect(messageMock.called).to.be.true;
		});

		it("sends a message when message is edited to change all mentioned users", async () => {
			const oldMessage = CustomMocks.getMessage();
			const newMessage = CustomMocks.getMessage();
			const messageMock = sandbox.stub(oldMessage.channel, "send");

			const mentionedUser1 = CustomMocks.getUser({ id: "328194044587147278" });
			const mentionedUser2 = CustomMocks.getUser({ id: "328194044587147277" });
			const mentionedUser3 = CustomMocks.getUser({ id: "328194044587147276" });
			const mentionedUser4 = CustomMocks.getUser({ id: "328194044587147275" });

			oldMessage.mentions = new MessageMentions(oldMessage, [mentionedUser1, mentionedUser2], [], false);
			oldMessage.content = "Waddup, <@328194044587147278> <@328194044587147277>!";

			newMessage.mentions = new MessageMentions(newMessage, [mentionedUser3, mentionedUser4], [], false);
			newMessage.content = "Waddup, <@328194044587147276> <@328194044587147275>";

			await handler.handle(oldMessage, newMessage);

			expect(messageMock.called).to.be.true;
		});

		it("does not send a message when a message is edited that didn't ping a user", async () => {
			const oldMessage = CustomMocks.getMessage();
			const newMessage = CustomMocks.getMessage();
			const messageMock = sandbox.stub(oldMessage.channel, "send");

			oldMessage.mentions = new MessageMentions(oldMessage, [], [], false);
			oldMessage.content = "Hey everybody!";

			newMessage.mentions = new MessageMentions(newMessage, [], [], false);
			newMessage.content = "Sup!";

			await handler.handle(oldMessage, newMessage);

			expect(messageMock.calledOnce).to.be.false;
		});

		it("does not send a message when it's author is a bot", async () => {
			const oldMessage = CustomMocks.getMessage();
			const newMessage = CustomMocks.getMessage();
			const messageMock = sandbox.stub(oldMessage.channel, "send");

			const author = BaseMocks.getUser();

			author.bot = true;

			oldMessage.author = author;
			oldMessage.mentions = new MessageMentions(oldMessage, [CustomMocks.getUser({ id: "328194044587147278" })], [], false);
			oldMessage.content = "Welcome <@328194044587147278>!";

			newMessage.author = author;
			newMessage.mentions = new MessageMentions(newMessage, [], [], false);
			newMessage.content = "Goodbye!";

			await handler.handle(oldMessage, newMessage);

			expect(messageMock.calledOnce).to.be.false;
		});

		it("does not send a message when author only removes mention of themselves", async () => {
			const oldMessage = CustomMocks.getMessage();
			const newMessage = CustomMocks.getMessage();
			const messageMock = sandbox.stub(oldMessage.channel, "send");

			const author = CustomMocks.getUser({ id: "328194044587147279" });

			oldMessage.author = author;
			oldMessage.mentions = new MessageMentions(oldMessage, [CustomMocks.getUser({ id: oldMessage.author.id })], [], false);
			oldMessage.content = `Sup <@${oldMessage.author.id}>`;

			newMessage.author = author;
			newMessage.mentions = new MessageMentions(newMessage, [], [], false);
			newMessage.content = "Sup";

			await handler.handle(oldMessage, newMessage);

			expect(messageMock.called).to.be.false;
		});

		it("does not send a message when message author removes a mention that is themself", async () => {
			const oldMessage = CustomMocks.getMessage();
			const newMessage = CustomMocks.getMessage();
			const messageMock = sandbox.stub(oldMessage.channel, "send");

			const author = CustomMocks.getUser({ id: "328194044587147279" });

			oldMessage.author = author;
			oldMessage.mentions = new MessageMentions(oldMessage, [author, CustomMocks.getUser({ id: "328194044587147278" })], [], false);
			oldMessage.content = `<@${oldMessage.author.id}> <@328194044587147278>`;

			newMessage.author = author;
			newMessage.mentions = new MessageMentions(newMessage, [CustomMocks.getUser({ id: "328194044587147278" })], [], false);
			newMessage.content = "<@328194044587147278>";

			await handler.handle(oldMessage, newMessage);

			expect(messageMock.called).to.be.false;
		});

		it("does not send a message when author only removes mentions of themself and bots", async () => {
			const oldMessage = CustomMocks.getMessage();
			const newMessage = CustomMocks.getMessage();
			const messageMock = sandbox.stub(oldMessage.channel, "send");

			const author = CustomMocks.getUser({ id: "328194044587147279" });
			const botUser = CustomMocks.getUser({ id: "328194044587147278" });

			botUser.bot = true;

			oldMessage.author = author;
			oldMessage.mentions = new MessageMentions(oldMessage, [oldMessage.author, botUser], [], false);
			oldMessage.content = `Hey, <@${oldMessage.author.id}> <@${botUser.id}>`;

			newMessage.author = author;
			newMessage.mentions = new MessageMentions(newMessage, [], [], false);
			newMessage.content = "Hey";

			await handler.handle(oldMessage, newMessage);

			expect(messageMock.called).to.be.false;
		});

		it("does not send a message when author only removes mentions of bots", async () => {
			const oldMessage = CustomMocks.getMessage();
			const newMessage = CustomMocks.getMessage();
			const messageMock = sandbox.stub(oldMessage.channel, "send");

			const author = CustomMocks.getUser({ id: "328194044587147279" });
			const botUser1 = CustomMocks.getUser({ id: "328194044587147278" });
			const botUser2 = CustomMocks.getUser({ id: "328194044587147277" });

			botUser1.bot = true;
			botUser2.bot = true;

			oldMessage.author = author;
			oldMessage.mentions = new MessageMentions(oldMessage, [botUser1, botUser2], [], false);
			oldMessage.content = `Hey, <@${botUser1.id}> <@${botUser2.id}>`;

			newMessage.author = author;
			newMessage.mentions = new MessageMentions(newMessage, [], [], false);
			newMessage.content = "Hey";

			await handler.handle(oldMessage, newMessage);

			expect(messageMock.called).to.be.false;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
