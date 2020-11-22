import { expect } from "chai";
import { Constants } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

import EventHandler from "../../../src/abstracts/EventHandler";
import LogMessageUpdateHandler from "../../../src/event/handlers/LogMessageDeleteHandler";

describe("LogMessageDeleteHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for MESSAGE_Delete", () => {
			const handler = new LogMessageUpdateHandler();

			expect(handler.getEvent()).to.equal(Constants.Events.MESSAGE_DELETE);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: EventHandler;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new LogMessageUpdateHandler();
		});

		it("sends a message in logs channel when a message is deleted", async () => {
			const message = BaseMocks.getMessage();
			const messageMock = sandbox.stub(message.guild.channels.cache, "find");

			message.content = "message content";

			await handler.handle(message);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("does not send a message in logs channel when message is deleted but content is empty - only image", async () => {
			const message = BaseMocks.getMessage();
			const messageMock = sandbox.stub(message.guild.channels.cache, "find");

			message.content = "";

			await handler.handle(message);

			expect(messageMock.calledOnce).to.be.false;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});

