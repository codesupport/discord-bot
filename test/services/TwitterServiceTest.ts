import { createSandbox, SinonSandbox, SinonStubbedInstance } from "sinon";
import { expect } from "chai";
import Twitter from "twitter";
import { Client as DiscordClient } from "discord.js";
import TwitterService from "../../src/services/TwitterService";
import MockDiscord from "../MockDiscord";
import * as getEnvironmentVariable from "../../src/utils/getEnvironmentVariable";

describe("TwitterService", () => {
	describe("::getInstance()", () => {
		it("creates an instance of TwitterService", () => {
			const sandbox = createSandbox();

			sandbox.stub(getEnvironmentVariable, "default");

			const service = TwitterService.getInstance();

			expect(service).to.be.instanceOf(TwitterService);

			sandbox.restore();
		});
	});

	describe("streamToDiscord()", () => {
		let sandbox: SinonSandbox;
		let twitter: SinonStubbedInstance<Twitter>;
		let twitterService: TwitterService;
		let discordClient: DiscordClient;

		beforeEach(() => {
			sandbox = createSandbox();
			sandbox.stub(getEnvironmentVariable, "default");
			twitter = sandbox.createStubInstance(Twitter);
			twitterService = TwitterService.getInstance();
			discordClient = new MockDiscord().getClient();
		});

		it("fetches the discord channel to send the message in", async () => {
			const fetch = sandbox.stub(discordClient.channels, "fetch");
			sandbox.stub(TwitterService.prototype, "handleTwitterStream")

			await twitterService.streamToDiscord(discordClient);

			expect(fetch.calledOnce).to.be.true;
		});

		it("streams twitter for statuses/filter on the codesupportdev account", async () => {
			sandbox.stub(TwitterService.prototype, "handleTwitterStream")
			await twitterService.streamToDiscord(discordClient);

			expect(twitter.stream.calledOnce).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});