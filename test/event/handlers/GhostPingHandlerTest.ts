import { expect } from "chai";
import { Collection, Constants, Guild, Message, MessageEmbed, MessageMentions, MessageReference } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";
import { BaseMocks, CustomMocks } from "@lambocreeper/mock-discord.js";;

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
			const message = CustomMocks.getMessage();
			const messageMock = sandbox.stub(message.channel, "send");

			message.mentions = new MessageMentions(message, [CustomMocks.getUser({ id: "328194044587147278" })], [], false);
			message.content = "Hey <@328194044587147278>!";

			await handler.handle(message);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("does not send a message when a message is deleted that didn't ping a user", async () => {
			const message = CustomMocks.getMessage();
			const messageMock = sandbox.stub(message.channel, "send");

			message.mentions = new MessageMentions(message, [], [], false);
			message.content = "Hey everybody!";

			await handler.handle(message);

			expect(messageMock.calledOnce).to.be.false;
		});

		it("does not send a message when it's author is a bot", async () => {
			const message = CustomMocks.getMessage();
			const messageMock = sandbox.stub(message.channel, "send");

			const author = BaseMocks.getUser();

			author.bot = true;

			message.author = author;
			message.mentions = new MessageMentions(message, [BaseMocks.getUser()], [], false);
			message.content = "Hey <@328194044587147278>, stop spamming or we'll arrest you!";

			await handler.handle(message);

			expect(messageMock.called).to.be.false;
		});

		it("does not send a message when author only mentions himself", async () => {
			const message = CustomMocks.getMessage();
			const messageMock = sandbox.stub(message.channel, "send");

			message.author = BaseMocks.getUser();
			message.mentions = new MessageMentions(message, [CustomMocks.getUser()], [], false);
			message.content = `<@${message.author.id}>`;

			await handler.handle(message);

			expect(messageMock.called).to.be.false;
		});

		it("sends a message when message author and someone else is being mentioned", async () => {
			const message = CustomMocks.getMessage();
			const messageMock = sandbox.stub(message.channel, "send");

			const author = CustomMocks.getUser();

			message.author = author;
			message.mentions = new MessageMentions(message, [author, CustomMocks.getUser({ id: "328194044587147278" })], [], false);
			message.content = `<@${message.author.id}> <@328194044587147278>`;

			await handler.handle(message);
			expect(messageMock.called).to.be.true;
		});

		it("provides additional info if message is a reply to another message", async () => {
			const message = CustomMocks.getMessage({guild: CustomMocks.getGuild()});
			const messageMock = sandbox.stub(message.channel, "send");
			const channelMock = CustomMocks.getTextChannel();
			const repliedToMessage = CustomMocks.getMessage({ id: "328194044587147280", guild: CustomMocks.getGuild()}, {
				channel: CustomMocks.getTextChannel({ id: "328194044587147278"})
			});
			const resolveChannelStub = sandbox.stub(message.guild.channels, "resolve").returns(channelMock);
			const fetchMessageStub = sandbox.stub(channelMock.messages, "fetch").returns(Promise.resolve(repliedToMessage));
			const author = CustomMocks.getUser();

			message.author = author;
			message.mentions = new MessageMentions(message, [CustomMocks.getUser({ id: "328194044587147278" })], [], false);
			message.guild.id = "328194044587147279";
			message.content = "this is a reply";
			message.reference = {
				channelId: "328194044587147278",
				guildId: "328194044587147279",
				messageId: "328194044587147280"
			};

			await handler.handle(message);
			expect(messageMock.called).to.be.true;
			expect(resolveChannelStub.called).to.be.true;
			expect(fetchMessageStub.called).to.be.true;
			const sentEmbed = messageMock.getCall(0).args[0];

			// expect(sentEmbed).to.be.an.instanceOf(MessageEmbed);
			// if (sentEmbed instanceof MessageEmbed) {
			// 	const replyToField = sentEmbed.fields.find(field => field.name === "Reply to");
			//
			// 	expect(replyToField).to.not.be.null;
			//
			// 	const messageLinkField = sentEmbed.fields.find(field => field.name === "Message replied to");
			//
			// 	expect(messageLinkField).to.not.be.null;
			// 	expect(messageLinkField.value).to.equal("https://discord.com/channels/328194044587147279/328194044587147278/328194044587147280");
			// }
		});

		it("does not send a message when author only mentions himself and bots", async () => {
			const message = CustomMocks.getMessage();
			const messageMock = sandbox.stub(message.channel, "send");

			const botUser = CustomMocks.getUser({id: "328194044587147278"});

			botUser.bot = true;

			message.author = BaseMocks.getUser();
			message.mentions = new MessageMentions(message, [message.author, botUser], [], false);
			message.content = `<@${message.author.id}> <@${botUser.id}>`;

			await handler.handle(message);

			expect(messageMock.called).to.be.false;
		});

		it("does not send a message when author only mentions bots", async () => {
			const message = CustomMocks.getMessage();
			const messageMock = sandbox.stub(message.channel, "send");

			const botUser = CustomMocks.getUser({id: "328194044587147278"});
			const botUser2 = CustomMocks.getUser({id: "328194044587147279"});

			botUser.bot = true;
			botUser2.bot = true;

			message.author = BaseMocks.getUser();
			message.mentions = new MessageMentions(message, [botUser, botUser2], [], false);
			message.content = `<@${botUser.id}> <@${botUser2.id}>`;

			await handler.handle(message);

			expect(messageMock.called).to.be.false;
		});

		it("does not send a message when author replies to a bot", async () => {
			const message = CustomMocks.getMessage({guild: CustomMocks.getGuild()});
			const messageMock = sandbox.stub(message.channel, "send");
			const channelMock = CustomMocks.getTextChannel();
			const repliedToMessage = CustomMocks.getMessage({ id: "328194044587147280", guild: CustomMocks.getGuild() }, {
				channel: CustomMocks.getTextChannel({ id: "328194044587147278"})
			});
			const resolveChannelStub = sandbox.stub(message.guild.channels, "resolve").returns(channelMock);
			const fetchMessageStub = sandbox.stub(channelMock.messages, "fetch").returns(Promise.resolve(repliedToMessage));
			const author = BaseMocks.getUser();
			const botUser = CustomMocks.getUser({id: "328194044587147276"});

			botUser.bot = true;

			message.author = author;
			message.mentions = new MessageMentions(message, [botUser], [], false);
			message.guild.id = "328194044587147279";
			message.content = "this is a reply";
			message.reference = {
				channelId: "328194044587147278",
				guildId: "328194044587147279",
				messageId: "328194044587147280"
			};

			await handler.handle(message);
			expect(messageMock.called).to.be.false;
			expect(resolveChannelStub.called).to.be.false;
			expect(fetchMessageStub.called).to.be.false;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});

