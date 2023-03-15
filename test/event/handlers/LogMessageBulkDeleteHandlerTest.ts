import { expect } from "chai";
import { Collection, Events, Message, Snowflake } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";
import { CustomMocks } from "@lambocreeper/mock-discord.js";

import EventHandler from "../../../src/abstracts/EventHandler";
import LogMessageBulkDeleteHandler from "../../../src/event/handlers/LogMessageBulkDeleteHandler";

function messageFactory(amount: number, options: { content: string; } | undefined = undefined) {
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

describe("LogMessageBulkDeleteHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for messageBulkDelete", () => {
			const handler = new LogMessageBulkDeleteHandler();

			expect(handler.getEvent()).to.equal(Events.MessageBulkDelete);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: EventHandler;
		let collection: Collection<Snowflake, Message>;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new LogMessageBulkDeleteHandler();
			collection = new Collection<Snowflake, Message>();
		});

		it("sends a message in logs channel when a message is deleted", async () => {
			const message = CustomMocks.getMessage({ content: "Test message" });
			const sendLogMock = sandbox.stub(message.guild.channels.cache, "find");

			collection.set("1", message);
			await handler.handle(collection);

			expect(sendLogMock.calledOnce).to.be.true;
		});

		it("sends messages in logs channel when multiple messages are deleted", async () => {
			const message = CustomMocks.getMessage({ content: "Test message" });
			const message2 = CustomMocks.getMessage({ content: "Test message" });
			const message3 = CustomMocks.getMessage({ content: "Test message" });
			const message4 = CustomMocks.getMessage({ content: "Test message" });
			const message5 = CustomMocks.getMessage({ content: "Test message" });
			const sendLogMock = sandbox.stub(message.guild.channels.cache, "find");

			collection
				.set("1", message)
				.set("2", message2)
				.set("3", message3)
				.set("4", message4)
				.set("5", message5);
			await handler.handle(collection);

			expect(sendLogMock.callCount).to.be.equal(5);
		});

		it("does not send a message in logs channel when message is deleted but content is empty - only image", async () => {
			const sendLogMock = sandbox.stub(Collection.prototype, "find");

			await handler.handle(messageFactory(1, {
				content: ""
			}));

			expect(sendLogMock.calledOnce).to.be.false;
		});

		it("does not send a message in logs channel when multiple messages are deleted but content is empty - only image", async () => {
			const sendLogMock = sandbox.stub(Collection.prototype, "find");

			await handler.handle(messageFactory(5, {
				content: ""
			}));

			expect(sendLogMock.calledOnce).to.be.false;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});

