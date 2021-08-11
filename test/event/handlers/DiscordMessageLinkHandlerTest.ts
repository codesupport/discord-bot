import { expect } from "chai";
import { Constants, Message, TextChannel } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";
import { CustomMocks } from "@lambocreeper/mock-discord.js";

import EventHandler from "../../../src/abstracts/EventHandler";
import MessagePreviewService from "../../../src/services/MessagePreviewService";
import DiscordMessageLinkHandler from "../../../src/event/handlers/DiscordMessageLinkHandler";

describe("DiscordMessageLinkHandler", () => {
	describe("Constructor()", () => {
		it("creates a handler for MESSAGE_CREATE", () => {
			const handler = new DiscordMessageLinkHandler();

			expect(handler.getEvent()).to.equal(Constants.Events.MESSAGE_CREATE);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: EventHandler;
		let message: Message;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new DiscordMessageLinkHandler();
			message = CustomMocks.getMessage({}, {
				channel: CustomMocks.getTextChannel()
			});
		});

		it("sends a message in message channel when contains discord message link mid sentence", async () => {
			const generatePreviewMock = sandbox.stub(MessagePreviewService.prototype, "generatePreview");

			message.content = "aaaaaaaaa\nhttps://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982 aaaa";

			await handler.handle(message);

			expect(generatePreviewMock.called).to.be.true;
		});

		it("sends a message in message channel when contains discord message link", async () => {
			const generatePreviewMock = sandbox.stub(MessagePreviewService.prototype, "generatePreview");

			message.content = "https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982";

			await handler.handle(message);

			expect(generatePreviewMock.called).to.be.true;
		});

		it("sends a single message in message channel when contains multiple discord message links however one is escaped", async () => {
			const generatePreviewMock = sandbox.stub(MessagePreviewService.prototype, "generatePreview");

			message.content = "https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982 <https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982>";

			await handler.handle(message);

			expect(generatePreviewMock.calledOnce).to.be.true;
		});

		it("sends multiple messages in message channel when contains multiple discord message link", async () => {
			const generatePreviewMock = sandbox.stub(MessagePreviewService.prototype, "generatePreview");

			message.content = "https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982 https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982";

			await handler.handle(message);

			expect(generatePreviewMock.calledTwice).to.be.true;
		});

		it("does not send a message if the message starts with < and ends with >", async () => {
			const generatePreviewMock = sandbox.stub(MessagePreviewService.prototype, "generatePreview");

			message.content = "<https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982>";

			await handler.handle(message);

			expect(generatePreviewMock.called).to.be.false;
		});

		it("does not send a message if the url was escaped mid sentence", async () => {
			const generatePreviewMock = sandbox.stub(MessagePreviewService.prototype, "generatePreview");

			message.content = "placeholderText <https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982> placeholderText";

			await handler.handle(message);

			expect(generatePreviewMock.called).to.be.false;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});