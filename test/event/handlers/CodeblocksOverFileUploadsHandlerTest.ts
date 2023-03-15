import { expect } from "chai";
import { Collection, Events, Message, Attachment, APIAttachment } from "discord.js";
import { SinonSandbox, createSandbox } from "sinon";
import { BaseMocks, CustomMocks } from "@lambocreeper/mock-discord.js";

import { EMBED_COLOURS, MOD_CHANNEL_ID } from "../../../src/config.json";
import EventHandler from "../../../src/abstracts/EventHandler";
import CodeblocksOverFileUploadsHandler from "../../../src/event/handlers/CodeblocksOverFileUploadsHandler";
import NumberUtils from "../../../src/utils/NumberUtils";

describe("CodeblocksOverFileUploadsHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for messageCreate", () => {
			const handler = new CodeblocksOverFileUploadsHandler();

			expect(handler.getEvent()).to.equal(Events.MessageCreate);
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
			message.attachments = new Collection<string, Attachment>();
		});

		it("does nothing when there are no attachments.", async () => {
			const addMock = sandbox.stub(message.channel, "send");

			await handler.handle(message);

			expect(addMock.calledOnce).to.be.false;
		});

		it("does nothing when there is a valid attachment.", async () => {
			const attachment: APIAttachment = {
				id: "720390958847361064",
				filename: "test.png",
				size: 500,
				url: "test.png",
				proxy_url: "test.png"
			};

			message.attachments.set("720390958847361064", Reflect.construct(Attachment, [attachment]));
			const addMockSend = sandbox.stub(message.channel, "send");

			await handler.handle(message);
			expect(addMockSend.notCalled).to.be.true;
		});

		it("does nothing when a not allowed extension is uploaded in an exempt channel.", async () => {
			const attachment: APIAttachment = {
				id: "720390958847361065",
				filename: "test.exe",
				size: 500,
				url: "test.exe",
				proxy_url: "test.exe"
			};

			message.attachments.set("720390958847361065", Reflect.construct(Attachment, [attachment]));
			message.channelId = MOD_CHANNEL_ID;
			const addMockSend = sandbox.stub(message.channel, "send");

			await handler.handle(message);
			expect(addMockSend.notCalled).to.be.true;
		});

		it("isn't case sensitive", async () => {
			const attachment: APIAttachment = {
				id: "720390958847361064",
				filename: "test.PNG",
				size: 500,
				url: "test.PNG",
				proxy_url: "test.PNG"
			};

			message.attachments.set("720390958847361064", Reflect.construct(Attachment, [attachment]));
			const addMockSend = sandbox.stub(message.channel, "send");

			await handler.handle(message);
			expect(addMockSend.notCalled).to.be.true;
		});

		it("sends a message and deletes the user's upload when there is an invalid attachment.", async () => {
			const attachment: APIAttachment = {
				id: "720390958847361064",
				filename: "test.cpp",
				size: 500,
				url: "test.cpp",
				proxy_url: "test.cpp"
			};

			message.attachments.set("720390958847361064", Reflect.construct(Attachment, [attachment]));
			const addMockSend = sandbox.stub(message.channel, "send");
			const addMockDelete = sandbox.stub(message, "delete");

			await handler.handle(message);
			const embed = addMockSend.getCall(0).firstArg.embeds[0];

			expect(addMockSend.calledOnce).to.be.true;
			expect(addMockDelete.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Uploading Files");
			expect(embed.data.description).to.equal("<@010101010101010101>, you tried to upload a \`.cpp\` file, which is not allowed. Please use codeblocks over attachments when sending code.");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.DEFAULT.toLowerCase()));
		});

		it("deletes the message when any attachment on the message is invalid.", async () => {
			const attachment: APIAttachment = {
				id: "720390958847361064",
				filename: "test.png",
				size: 500,
				url: "test.png",
				proxy_url: "test.png"
			};

			const attachment2: APIAttachment = {
				id: "72039095884736105",
				filename: "test.cpp",
				size: 500,
				url: "test.cpp",
				proxy_url: "test.cpp"
			};

			message.attachments.set("720390958847361064", Reflect.construct(Attachment, [attachment]));
			message.attachments.set("72039095884736104", Reflect.construct(Attachment, [attachment2]));
			const addMockSend = sandbox.stub(message.channel, "send");
			const addMockDelete = sandbox.stub(message, "delete");

			await handler.handle(message);

			const embed = addMockSend.getCall(0).firstArg.embeds[0];

			expect(addMockSend.calledOnce).to.be.true;
			expect(addMockDelete.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Uploading Files");
			expect(embed.data.description).to.equal("<@010101010101010101>, you tried to upload a \`.cpp\` file, which is not allowed. Please use codeblocks over attachments when sending code.");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.DEFAULT.toLowerCase()));
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
