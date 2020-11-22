import { expect } from "chai";
import { Constants, Message } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";
import { CustomMocks } from "@lambocreeper/mock-discord.js";

import EventHandler from "../../../src/abstracts/EventHandler";
import LogMessageUpdateHandler from "../../../src/event/handlers/LogMessageUpdateHandler";

describe("LogMessageUpdateHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for MESSAGE_UPDATE", () => {
			const handler = new LogMessageUpdateHandler();

			expect(handler.getEvent()).to.equal(Constants.Events.MESSAGE_UPDATE);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: EventHandler;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new LogMessageUpdateHandler();
		});

		it("doesn't send a message if the old message content is the same as the new message content", async () => {
			const oldMessage = CustomMocks.getMessage();
			const newMessage = CustomMocks.getMessage();
			const messageMock = sandbox.stub(oldMessage.guild.channels.cache, "find");

			oldMessage.content = "example message";
			newMessage.content = "example message";

			await handler.handle(oldMessage, newMessage);

			expect(messageMock.calledOnce).to.be.false;
		});

		it("doesn't send a message if the new message content is empty", async () => {
			const oldMessage = CustomMocks.getMessage();
			const newMessage = CustomMocks.getMessage();
			const messageMock = sandbox.stub(oldMessage.guild.channels.cache, "find");

			oldMessage.content = "asdf";
			newMessage.content = "";

			await handler.handle(oldMessage, newMessage);

			expect(messageMock.calledOnce).to.be.false;
		});

		it("sends a message if the message contents are different", async () => {
			const oldMessage = CustomMocks.getMessage();
			const newMessage = CustomMocks.getMessage();
			const messageMock = sandbox.stub(oldMessage.guild.channels.cache, "find");

			oldMessage.content = "oldMessage content";
			newMessage.content = "newMessage content";

			await handler.handle(oldMessage, newMessage);

			expect(messageMock.calledOnce).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});

