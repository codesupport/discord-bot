import { expect } from "chai";
import { Events, Message, TextChannel } from "discord.js";
import {SinonSandbox, createSandbox, SinonStubbedInstance} from "sinon";
import { CustomMocks } from "@lambocreeper/mock-discord.js";

import EventHandler from "../../../src/abstracts/EventHandler";
import MessagePreviewService from "../../../src/services/MessagePreviewService";
import DiscordMessageLinkHandler from "../../../src/event/handlers/DiscordMessageLinkHandler";

describe("DiscordMessageLinkHandler", () => {
	describe("Constructor()", () => {
		it("creates a handler for messageCreate", () => {
			const sandbox = createSandbox();
			const handler = new DiscordMessageLinkHandler(sandbox.createStubInstance(MessagePreviewService));

			expect(handler.getEvent()).to.equal(Events.MessageCreate);
			sandbox.restore();
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: EventHandler;
		let messagePreviewServiceMock: SinonStubbedInstance<MessagePreviewService>;
		let message: Message;

		beforeEach(() => {
			sandbox = createSandbox();
			messagePreviewServiceMock = sandbox.createStubInstance(MessagePreviewService);
			handler = new DiscordMessageLinkHandler(messagePreviewServiceMock);
			message = CustomMocks.getMessage({}, {
				channel: CustomMocks.getTextChannel()
			});
		});

		it("sends a message in message channel when contains discord message link mid sentence", async () => {
			message.content = "aaaaaaaaa\nhttps://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982 aaaa";

			await handler.handle(message);

			expect(messagePreviewServiceMock.generatePreview.called).to.be.true;
		});

		it("sends a message in message channel when contains discord message link", async () => {
			message.content = "https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982";

			await handler.handle(message);

			expect(messagePreviewServiceMock.generatePreview.called).to.be.true;
		});

		it("sends a single message in message channel when contains multiple discord message links however one is escaped", async () => {
			message.content = "https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982 <https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982>";

			await handler.handle(message);

			expect(messagePreviewServiceMock.generatePreview.called).to.be.true;
		});

		it("sends multiple messages in message channel when contains multiple discord message link", async () => {
			message.content = "https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982 https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982";

			await handler.handle(message);

			expect(messagePreviewServiceMock.generatePreview.called).to.be.true;
		});

		it("does not send a message if the message starts with < and ends with >", async () => {
			message.content = "<https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982>";

			await handler.handle(message);

			expect(messagePreviewServiceMock.generatePreview.called).to.be.false;
		});

		it("does not send a message if the url was escaped mid sentence", async () => {
			message.content = "placeholderText <https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982> placeholderText";

			await handler.handle(message);

			expect(messagePreviewServiceMock.generatePreview.called).to.be.false;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
