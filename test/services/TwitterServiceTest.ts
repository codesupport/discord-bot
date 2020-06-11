import { createSandbox, SinonSandbox, SinonStubbedInstance } from "sinon";
import { expect } from "chai";
import Twitter from "twitter";
import { Client as DiscordClient } from "discord.js";
import TwitterService from "../../src/services/TwitterService";
import MockDiscord from "../MockDiscord";

describe("TwitterService", () => {
	describe("::getInstance()", () => {
		const service = TwitterService.getInstance();

		expect(service).to.be.instanceOf(TwitterService);
	});

	describe("streamToDiscord()", () => {
		let sandbox: SinonSandbox;
		let twitter: SinonStubbedInstance<Twitter>;
		let twitterService: TwitterService;
		let discordClient: DiscordClient;

		beforeEach(() => {
			sandbox = createSandbox();
			twitter = sandbox.createStubInstance(Twitter);
			twitterService = TwitterService.getInstance();
			discordClient = new MockDiscord().getClient();
		});

		it("fetches the discord channel to send the message in", async () => {
			const fetch = sandbox.stub(discordClient.channels, "fetch");

			await twitterService.streamToDiscord(discordClient);

			expect(fetch.calledOnce).to.be.true;
		});

		it("streams twitter for statuses/filter on the codesupportdev account", async () => {
			const stream = sandbox.stub(twitter, "stream");

			await twitterService.streamToDiscord(discordClient);

			expect(stream.calledOnce).to.be.true;
		});

		afterEach(() => {
			sandbox.reset();
		});
	});
});