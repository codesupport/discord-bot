import { expect } from "chai";
import { Collection, Constants, Message, Snowflake } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";
import { CustomMocks } from "@lambocreeper/mock-discord.js";

import EventHandler from "../../../src/abstracts/EventHandler";
import MessageConfigOptions from "@lambocreeper/mock-discord.js/build/interfaces/MessageConfigOptions";
import LogMessageBulkDeleteHandler from "../../../src/event/handlers/LogMessageBulkDeleteHandler";

function messageFactory(amount: number, options: MessageConfigOptions | undefined = undefined) {
	const collection = new Collection<Snowflake, Message>();

	for (let i = 0; i < amount; i++) {
		if (options) {
			collection.set(i.toString(), CustomMocks.getMessage(options));
		} else {
			collection.set(i.toString(), CustomMocks.getMessage());
		}
	}

	return collection;
}

describe("LogMessageDeleteHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for MESSAGE_Delete", () => {
			const handler = new LogMessageBulkDeleteHandler();

			expect(handler.getEvent()).to.equal(Constants.Events.MESSAGE_BULK_DELETE);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: EventHandler;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new LogMessageBulkDeleteHandler();
		});

		it("sends a message in logs channel when a message is deleted", async () => {
			const sendLogMock = sandbox.stub(Collection.prototype, "find");

			await handler.handle(messageFactory(1));

			expect(sendLogMock.calledOnce).to.be.true;
		});

		it("sends messages in logs channel when multiple messages are deleted", async () => {
			const sendLogMock = sandbox.stub(Collection.prototype, "find");

			await handler.handle(messageFactory(5));

			expect(sendLogMock.callCount).to.be.eq(5);
		});

		it("does not send a message in logs channel when message is deleted but content is empty - only image", async () => {
			const sendLogMock = sandbox.stub(Collection.prototype, "find");

			await handler.handle(messageFactory(1, {
				content: ''
			}));

			expect(sendLogMock.calledOnce).to.be.false;
		});

		it("does not send a message in logs channel when multiple messages are deleted but content is empty - only image", async () => {
			const sendLogMock = sandbox.stub(Collection.prototype, "find");

			await handler.handle(messageFactory(5, {
				content: ''
			}));

			expect(sendLogMock.calledOnce).to.be.false;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});

