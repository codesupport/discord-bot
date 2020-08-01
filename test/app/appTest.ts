import { expect } from "chai";
import { SinonSandbox, createSandbox, SinonStub } from "sinon";
import { Client, TextChannel, ChannelManager } from "discord.js";

import app from "../../src/app";
import DirectoryUtils from "../../src/utils/DirectoryUtils";
import MockHandler from "../MockHandler";
import MockDiscord from "../MockDiscord";
import { handlers_directory, AUTHENTICATION_MESSAGE_CHANNEL, AUTHENTICATION_MESSAGE_ID, PRODUCTION_ENV } from "../../src/config.json";

describe("app", () => {
	let sandbox: SinonSandbox;
	let loginStub: SinonStub;

	beforeEach(() => {
		sandbox = createSandbox();

		loginStub = sandbox.stub(Client.prototype, "login");

		process.env.DISCORD_TOKEN = "FAKE_TOKEN";
	});

	it("should throw error if DISCORD_TOKEN is not set", async () => {
		process.env.DISCORD_TOKEN = undefined;

		try {
			await app();
		} catch ({ message }) {
			expect(message).to.equal("You must supply the DISCORD_TOKEN environment variable.");
		}
	});

	it("should login with the provided DISCORD_TOKEN", async () => {
		sandbox.stub(DirectoryUtils, "getFilesInDirectory").callsFake(() => []);

		await app();

		expect(loginStub.calledWith("FAKE_TOKEN")).to.be.true;
	});

	// Fix me
	it("should bind handlers to events", async () => {
		const onStub = sandbox.stub(Client.prototype, "on");

		sandbox.stub(DirectoryUtils, "getFilesInDirectory").callsFake(() => []);

		const handler = new MockHandler();

		await app();

		expect(onStub.calledWith(handler.getEvent(), handler.handle));
	});

	it("should fetch auth channel and messages in production environment", async () => {
		const testEnv = process.env.NODE_ENV;

		process.env.NODE_ENV = PRODUCTION_ENV;

		const mockDiscord = new MockDiscord();
		const textChannel = mockDiscord.getTextChannel();

		const fetchChannelsStub = sandbox.stub(ChannelManager.prototype, "fetch").callsFake(async () => textChannel);
		const fetchMessagesStub = sandbox.stub(textChannel.messages, "fetch");

		await app();

		expect(fetchChannelsStub.calledWith(AUTHENTICATION_MESSAGE_CHANNEL)).to.be.true;
		expect(fetchMessagesStub.calledWith(AUTHENTICATION_MESSAGE_ID)).to.be.true;

		process.env.NODE_ENV = testEnv;
	});

	afterEach(() => {
		sandbox.restore();
	});
});