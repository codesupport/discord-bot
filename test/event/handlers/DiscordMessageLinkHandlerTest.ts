import { expect } from "chai";
import { Constants } from "discord.js";
import DiscordMessageLinkHandler from "../../../src/event/handlers/DiscordMessageLinkHandler";
import { SinonSandbox, createSandbox } from "sinon";
import EventHandler from "../../../src/abstracts/EventHandler";
import MockDiscord from "../../MockDiscord";
import MessagePreviewService from "../../../src/services/MessagePreviewService";

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
		let discordMock: MockDiscord;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new DiscordMessageLinkHandler();
			discordMock = new MockDiscord();
		});

		it("sends a message in message channel when contains discord message link", async () => {
			const message = discordMock.getMessage();
			const channel = discordMock.getTextChannel();
			const generatePreviewMock = sandbox.stub(MessagePreviewService.prototype, "generatePreview");

			message.content = "https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982";
			message.channel = channel;

			await handler.handle(message);

			expect(generatePreviewMock.called).to.be.true;
		});

		it("does not send a message if the message starts with a !", async () => {
			const message = discordMock.getMessage();
			const channel = discordMock.getTextChannel();
			const generatePreviewMock = sandbox.stub(MessagePreviewService.prototype, "generatePreview");

			message.content = "!https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982";
			message.channel = channel;

			await handler.handle(message);

			expect(generatePreviewMock.called).to.be.false;
		});
		afterEach(() => {
			sandbox.restore();
		});
	});
});