import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import Twitter from "twitter";
import { TextChannel } from "discord.js";
import TwitterService from "../../src/services/TwitterService";
import * as getEnvironmentVariable from "../../src/utils/getEnvironmentVariable";

// @ts-ignore - TS does not like MockDiscord not living in src/
import MockDiscord from "../MockDiscord";
import { EMBED_COLOURS } from "../../src/config.json";

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
		let twitterService: TwitterService;
		let channel: TextChannel;

		beforeEach(() => {
			sandbox = createSandbox();
			sandbox.stub(getEnvironmentVariable, "default");
			twitterService = TwitterService.getInstance();
			channel = new MockDiscord().getTextChannel();
		});

		it("streams twitter for statuses/filter on the codesupportdev account", async () => {
			sandbox.stub(twitterService, "handleTwitterStream");

			const streamSpy = sandbox.spy(Twitter.prototype, "stream");

			await twitterService.streamToDiscord(channel);

			expect(streamSpy.calledOnce).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe("handleTwitterStream()", () => {
		let sandbox: SinonSandbox;
		let twitterService: TwitterService;
		let channel: TextChannel;

		beforeEach(() => {
			sandbox = createSandbox();
			sandbox.stub(getEnvironmentVariable, "default");
			twitterService = TwitterService.getInstance();
			channel = new MockDiscord().getTextChannel();
		});

		it("does not send a message if the tweet does not start with an @", async () => {
			const send = sandbox.stub(channel, "send");

			await twitterService.handleTwitterStream({
				id_str: "",
				extended_tweet: {
					full_text: "@This does not start with an @"
				}
			}, channel);

			expect(send.calledOnce).to.be.false;
		});

		it("sends an embed with the tweet contents and url", async () => {
			const send = sandbox.stub(channel, "send");

			await twitterService.handleTwitterStream({
				id_str: "tweet-id",
				extended_tweet: {
					full_text: "This is my tweet"
				}
			}, channel);

			expect(send.calledOnce).to.be.true;

			const { embed } = send.getCall(0).args[0];

			expect(embed.title).to.equal("CodeSupport Twitter");
			expect(embed.description).to.equal("This is my tweet\n\nhttps://twitter.com/codesupportdev/status/tweet-id");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});