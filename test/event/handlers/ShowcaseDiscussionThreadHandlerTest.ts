import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import { CustomMocks } from "@lambocreeper/mock-discord.js";
import { Events } from "discord.js";
import ShowcaseDiscussionThreadHandler from "../../../src/event/handlers/ShowcaseDiscussionThreadHandler";
import EventHandler from "../../../src/abstracts/EventHandler";
import getConfigValue from "../../../src/utils/getConfigValue";

describe("ShowcaseDiscussionThreadHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for messageCreate", () => {
			const handler = new ShowcaseDiscussionThreadHandler();

			expect(handler.getEvent()).to.equal(Events.MessageCreate);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: EventHandler;

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new ShowcaseDiscussionThreadHandler();
		});

		it("does nothing if the message is not sent in the showcase channel", async () => {
			const message = CustomMocks.getMessage({ channel_id: "not-the-showcase-channel" });
			const startThreadStub = sandbox.stub(message, "startThread");

			await handler.handle(message);

			expect(startThreadStub.called).to.be.false;
		});

		it("creates a thread if the message is sent in the showcase channel", async () => {
			const message = CustomMocks.getMessage({ channel_id: getConfigValue("SHOWCASE_CHANNEL_ID") });
			const startThreadStub = sandbox.stub(message, "startThread");

			await handler.handle(message);

			expect(startThreadStub.called).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
