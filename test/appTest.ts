import { expect } from "chai";
import { SinonSandbox, createSandbox, SinonStub } from "sinon";
import { Client, ChannelManager } from "discord.js";
import { BaseMocks } from "@lambocreeper/mock-discord.js";
import axios from "axios";
import App from "../src/app";
import DirectoryUtils from "../src/utils/DirectoryUtils";
import MockHandler from "./MockHandler";
import { AUTHENTICATION_MESSAGE_CHANNEL, AUTHENTICATION_MESSAGE_ID, PRODUCTION_ENV } from "../src/config.json";

describe("App", () => {
	let sandbox: SinonSandbox;
	let loginStub: SinonStub;
	let getStub: SinonStub;

	beforeEach(() => {
		sandbox = createSandbox();

		loginStub = sandbox.stub(Client.prototype, "login");
		getStub = sandbox.stub(axios, "get").resolves();

		process.env.DISCORD_TOKEN = "FAKE_TOKEN";
		process.env.HEALTH_CHECK_URL = "https://health-check.com";
	});

	describe("constructor()", () => {
		it("should throw error if DISCORD_TOKEN is not set", async () => {
			process.env.DISCORD_TOKEN = undefined;

			try {
				await new App();
			} catch ({ message }) {
				expect(message).to.equal("You must supply the DISCORD_TOKEN environment variable.");
			}
		});
	});

	describe("reportHealth()", () => {
		it("sends a GET request to a health check endpoint", () => {
			new App().reportHealth();

			expect(getStub.calledOnce).to.be.true;
			expect(getStub.calledWith("https://health-check.com")).to.be.true;
		});
	});

	describe("init()", () => {
		it("should login with the provided DISCORD_TOKEN", async () => {
			sandbox.stub(DirectoryUtils, "getFilesInDirectory").resolves([]);

			await new App().init();

			expect(loginStub.calledWith("FAKE_TOKEN")).to.be.true;
		});

		it("should look for slash commands", async () => {
			const getFilesStub = sandbox.stub(DirectoryUtils, "getFilesInDirectory").resolves([]);

			await new App().init();

			expect(getFilesStub.args[0][1]).to.equal("Command.js");
		});

		it("should look for handler files", async () => {
			const getFilesStub = sandbox.stub(DirectoryUtils, "getFilesInDirectory").resolves([]);

			await new App().init();

			expect(getFilesStub.args[1][1]).to.equal("Handler.js");
		});

		it("should bind handlers to events", async () => {
			// eslint-disable-next-line global-require
			sandbox.stub(DirectoryUtils, "getFilesInDirectory").callsFake(async () => [require("./MockHandler")]);
			const onStub = sandbox.stub(Client.prototype, "on");

			await new App().init();

			const mockHandler = new MockHandler();

			expect(onStub.calledWith(mockHandler.getEvent())).to.be.true;
		});

		it("should fetch auth channel and messages in production environment", async () => {
			const testEnv = process.env.NODE_ENV;

			process.env.NODE_ENV = PRODUCTION_ENV;

			sandbox.stub(DirectoryUtils, "getFilesInDirectory").callsFake(() => []);

			const textChannel = BaseMocks.getTextChannel();

			const fetchChannelsStub = sandbox.stub(ChannelManager.prototype, "fetch").callsFake(async () => textChannel);
			const fetchMessagesStub = sandbox.stub(textChannel.messages, "fetch");

			await new App().init();

			expect(fetchChannelsStub.calledWith(AUTHENTICATION_MESSAGE_CHANNEL)).to.be.true;
			expect(fetchMessagesStub.calledWith(AUTHENTICATION_MESSAGE_ID)).to.be.true;

			process.env.NODE_ENV = testEnv;
		});
	});

	afterEach(() => {
		sandbox.restore();
	});
});
