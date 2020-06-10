import { expect } from "chai";
import {Constants, Message, Collection, MessageAttachment} from "discord.js";
import CodeblocksOverFileUploadsHandler from "../../../src/event/handlers/CodeblocksOverFileUploadsHandler";
import { SinonSandbox, createSandbox } from "sinon";
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
		});

		it("does nothing when there are no attachments.", async () => {
            message.id = "1234";
            message.attachments = new Collection();

            const addMock = sandbox.stub(message.channel, "send");

			await handler.handle(message);

			expect(addMock.calledOnce).to.be.false;
        });
        
        it("sends a message and deletes the user's upload when there is an invalid attachment.", async () => {
            message.id = "1234";
            message.attachments = new Collection();
            message.attachments[0] = new MessageAttachment("Wah.txt", "test.txt");

            const addMock = sandbox.stub(message, "delete");

			await handler.handle(message);

			expect(addMock.calledOnce).to.be.true;
		});

		afterEach(() => {
			sandbox.reset();
		});
	});
});