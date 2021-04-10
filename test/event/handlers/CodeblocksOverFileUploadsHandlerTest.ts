import { expect } from "chai";
import { Collection, Constants, Message, MessageAttachment } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";
import { BaseMocks, CustomMocks } from "@lambocreeper/mock-discord.js";

import { EMBED_COLOURS } from "../../../src/config.json";
import EventHandler from "../../../src/abstracts/EventHandler";
import CodeblocksOverFileUploadsHandler from "../../../src/event/handlers/CodeblocksOverFileUploadsHandler";

describe("CodeblocksOverFileUploadsHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for MESSAGE_CREATE", () => {
			const handler = new CodeblocksOverFileUploadsHandler();

			expect(handler.getEvent()).to.equal(Constants.Events.MESSAGE_CREATE);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: EventHandler;
		let message: Message;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new CodeblocksOverFileUploadsHandler();
			message = CustomMocks.getMessage({
				id: "1234",
				author: BaseMocks.getUser()
			});
			message.client.user = BaseMocks.getUser();
			message.attachments = new Collection<string, MessageAttachment>();
		});

		it("does nothing when there are no attachments.", async () => {
			const addMock = sandbox.stub(message.channel, "send");

			await handler.handle(message);

			expect(addMock.calledOnce).to.be.false;
		});

		it("does nothing when there is a valid attachment.", async () => {
			message.attachments.set("720390958847361064", new MessageAttachment("720390958847361064", "test.png"));
			const addMockSend = sandbox.stub(message.channel, "send");

			await handler.handle(message);
			expect(addMockSend.notCalled).to.be.true;
		});

		it("isn't case sensitive", async () => {
			message.attachments.set("720390958847361064", new MessageAttachment("720390958847361064", "test.PNG"));
			const addMockSend = sandbox.stub(message.channel, "send");

			await handler.handle(message);
			expect(addMockSend.notCalled).to.be.true;
		});

		it("sends a message and deletes the user's upload when there is an invalid attachment.", async () => {
			message.attachments.set("720390958847361064", new MessageAttachment("720390958847361064", "test.pdf"));
			const addMockSend = sandbox.stub(message.channel, "send");
			const addMockDelete = sandbox.stub(message, "delete");

			await handler.handle(message);
			// @ts-ignore - firstArg does not live on getCall()
			const embed = addMockSend.getCall(0).firstArg.embed;

			expect(addMockSend.calledOnce).to.be.true;
			expect(addMockDelete.calledOnce).to.be.true;
			expect(embed.title).to.equal("Uploading Files");
			expect(embed.description).to.equal("<@010101010101010101>, you tried to upload a \`.pdf\` file, which is not allowed. Please use codeblocks over attachments when sending code.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
		});

		it("deletes the message when any attachment on the message is invalid.", async () => {
			message.attachments.set("720390958847361064", new MessageAttachment("720390958847361064", "test.png"));
			message.attachments.set("72039095884736104", new MessageAttachment("72039095884736105", "test.pdf"));
			const addMockSend = sandbox.stub(message.channel, "send");
			const addMockDelete = sandbox.stub(message, "delete");

			await handler.handle(message);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = addMockSend.getCall(0).firstArg.embed;

			expect(addMockSend.calledOnce).to.be.true;
			expect(addMockDelete.calledOnce).to.be.true;
			expect(embed.title).to.equal("Uploading Files");
			expect(embed.description).to.equal("<@010101010101010101>, you tried to upload a \`.pdf\` file, which is not allowed. Please use codeblocks over attachments when sending code.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
