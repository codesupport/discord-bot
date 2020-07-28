import { expect } from "chai";
import { Constants, Message, Collection, MessageAttachment } from "discord.js";
import CodeblocksOverFileUploadsHandler from "../../../src/event/handlers/CodeblocksOverFileUploadsHandler";
import { SinonSandbox, createSandbox } from "sinon";
import { EMBED_COLOURS } from "../../../src/config.json";
import EventHandler from "../../../src/abstracts/EventHandler";
// @ts-ignore - TS does not like MockDiscord not living in src/
import MockDiscord from "../../MockDiscord";

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
		let discordMock: MockDiscord;
		let message: Message;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new CodeblocksOverFileUploadsHandler();
			discordMock = new MockDiscord();
			message = discordMock.getMessage();
			message.id = "1234";
			message.attachments = new Collection<string, MessageAttachment>();
			message.author = discordMock.getUser();
			message.client.user = discordMock.getUser();
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
			message.attachments.set("720390958847361064", new MessageAttachment("720390958847361064", "test.cpp"));
			const addMockSend = sandbox.stub(message.channel, "send");
			const addMockDelete = sandbox.stub(message, "delete");

			await handler.handle(message);
			// @ts-ignore - firstArg does not live on getCall()
			const embed = addMockSend.getCall(0).firstArg.embed;

			expect(addMockSend.calledOnce).to.be.true;
			expect(addMockDelete.calledOnce).to.be.true;
			expect(embed.title).to.equal("Uploading Files");
			expect(embed.description).to.equal("<@user-id>, you tried to upload a \`.cpp\` file, which is not allowed. Please use codeblocks over attachments when sending code.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
		});

		it("deletes the message when any attachment on the message is invalid.", async () => {
			message.attachments.set("720390958847361064", new MessageAttachment("720390958847361064", "test.png"));
			message.attachments.set("72039095884736104", new MessageAttachment("72039095884736105", "test.cpp"));
			const addMockSend = sandbox.stub(message.channel, "send");
			const addMockDelete = sandbox.stub(message, "delete");

			await handler.handle(message);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = addMockSend.getCall(0).firstArg.embed;

			expect(addMockSend.calledOnce).to.be.true;
			expect(addMockDelete.calledOnce).to.be.true;
			expect(embed.title).to.equal("Uploading Files");
			expect(embed.description).to.equal("<@user-id>, you tried to upload a \`.cpp\` file, which is not allowed. Please use codeblocks over attachments when sending code.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
		});

		afterEach(() => {
			sandbox.reset();
		});
	});
});