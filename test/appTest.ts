import { expect } from "chai";
import { SinonSandbox, createSandbox, SinonStub } from "sinon";
import { Client, TextChannel, ChannelManager } from "discord.js";

import app from "../src/app";
import DirectoryUtils from "../src/utils/DirectoryUtils";
import MockHandler from "./MockHandler";
import MockDiscord from "./MockDiscord";
import { handlers_directory, AUTHENTICATION_MESSAGE_CHANNEL, AUTHENTICATION_MESSAGE_ID, PRODUCTION_ENV } from "../src/config.json";

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

	it("should look for handler files", async () => {
		const getFilesStub = sandbox.stub(DirectoryUtils, "getFilesInDirectory").callsFake(() => []);

		await app();

		expect(getFilesStub.args[0][1]).to.equal("Handler.js");
	});

	it("should bind handlers to events", async () => {
		sandbox.stub(DirectoryUtils, "getFilesInDirectory").callsFake(async () => [require("./MockHandler")]);

		const onStub = sandbox.stub(Client.prototype, "on");

		await app();

		const mockHandler = new MockHandler();

		expect(onStub.calledWith(mockHandler.getEvent())).to.be.true;
	});

	it("should fetch auth channel and messages in production environment", async () => {
		const testEnv = process.env.NODE_ENV;

		process.env.NODE_ENV = PRODUCTION_ENV;

		sandbox.stub(DirectoryUtils, "getFilesInDirectory").callsFake(() => []);

		const mockDiscord = new MockDiscord();
		const textChannel = mockDiscord.getTextChannel();

		const fetchChannelsStub = sandbox.stub(ChannelManager.prototype, "fetch").callsFake(async () => textChannel);
		const fetchMessagesStub = sandbox.stub(textChannel.messages, "fetch");

		await app();

		expect(fetchChannelsStub.calledWith(AUTHENTICATION_MESSAGE_CHANNEL)).to.be.true;
		expect(fetchMessagesStub.calledWith(AUTHENTICATION_MESSAGE_ID)).to.be.true;

		process.env.NODE_ENV = testEnv;
	});

	it("should log thrown errors", async () => {
		sandbox.stub(DirectoryUtils, "getFilesInDirectory").callsFake(() => {
			throw new Error("I had one job");
		});

		const consoleErrorStub = sandbox.stub(global.console, "error");

		await app();

		expect(consoleErrorStub.calledOnce).to.be.true;
	});

	afterEach(() => {
		sandbox.restore();
	});
});