import { expect } from "chai";
import { Constants } from "discord.js";
import DiscordMessageLinkHandler from "../../../src/event/handlers/DiscordMessageLinkHandler";
import { SinonSandbox, createSandbox } from "sinon";
import EventHandler from "../../../src/abstracts/EventHandler";
import MockDiscord from "../../MockDiscord";

describe("DiscordMessageLinkHandler", () => {
	describe("Constructor()", () => {
		it("creates a handler for MESSAGE_Create", () => {
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
		});
	});
});