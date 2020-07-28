import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import Twitter from "twitter";
import { EventEmitter } from "events";
import { TextChannel } from "discord.js";
import TwitterService from "../../src/services/TwitterService";
import * as getEnvironmentVariable from "../../src/utils/getEnvironmentVariable";

// @ts-ignore - TS does not like MockDiscord not living in src/
import MockDiscord from "../MockDiscord";
import { EMBED_COLOURS, TWITTER_ID } from "../../src/config.json";

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

		it("streams twitter for statuses/filter on the codesupportdev account", (done) => {
			let eventEmitter = new EventEmitter();

			const streamSpy = sandbox.stub(Twitter.prototype, "stream").returns(eventEmitter);
			const send = sandbox.stub(channel, "send");

			twitterService.streamToDiscord(channel).then(() => {
				const tweet = {
					id_str: "1234",
					text: "1234",
					user: {
						id_str: "1234"
					},
					extended_tweet: {
						full_text: "1234"
					},
					retweeted_status: {
						id_str: "1244"
					}
				}

				eventEmitter.on("data", () => {
					done();
				})

				eventEmitter.emit("data", tweet);
				expect(streamSpy.calledOnce).to.be.true;
				expect(send.calledOnce).to.be.true;
			});
		}).timeout(1000);

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

		it("does not send a message if the tweet starts with an @", async () => {
			const send = sandbox.stub(channel, "send");

			await twitterService.handleTwitterStream({
				id_str: "",
				text: "@This starts with an @",
				user: {
					id_str: ""
				}
			}, channel);

			expect(send.calledOnce).to.be.false;
		});

		it("does not send a message if the retweet is not from the CodeSupport account", async () => {
			const send = sandbox.stub(channel, "send");

			await twitterService.handleTwitterStream({
				id_str: "",
				text: "RT @user",
				user: {
					id_str: "1"
				},
				retweeted_status: {
					id_str: ""
				}
			}, channel);

			expect(send.calledOnce).to.be.false;
		});

		it("sends an embed with the tweet contents and url", async () => {
			const send = sandbox.stub(channel, "send");

			await twitterService.handleTwitterStream({
				id_str: "tweet-id",
				text: "This is my tweet",
				user: {
					id_str: ""
				}
			}, channel);

			expect(send.calledOnce).to.be.true;

			const { embed } = send.getCall(0).args[0];

			expect(embed.title).to.equal("CodeSupport Twitter");
			expect(embed.description).to.equal("This is my tweet\n\nhttps://twitter.com/codesupportdev/status/tweet-id");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
		});

		it("sends an embed with the tweet contents and url using the extended_tweet property", async () => {
			const send = sandbox.stub(channel, "send");

			await twitterService.handleTwitterStream({
				id_str: "tweet-id",
				text: "This is a test tweet that I stole from codesupport's twitter.",
				user: {
					id_str: ""
				},
				extended_tweet: {
					full_text: "The fundamentals of programming give you a solid foundation for building more complex applications. Without having a good understanding of them, you'll likely lose motivation and get discouraged."
				}
			}, channel);

			expect(send.calledOnce).to.be.true;

			const { embed } = send.getCall(0).args[0];

			expect(embed.title).to.equal("CodeSupport Twitter");
			expect(embed.description).to.equal("The fundamentals of programming give you a solid foundation for building more complex applications. Without having a good understanding of them, you'll likely lose motivation and get discouraged.\n\nhttps://twitter.com/codesupportdev/status/tweet-id");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
		});

		it("sends an embed with the retweeted contents and url", async () => {
			const send = sandbox.stub(channel, "send");

			await twitterService.handleTwitterStream({
				id_str: "tweet-id",
				text: "RT @user: This is my tweet",
				user: {
					id_str: TWITTER_ID
				},
				retweeted_status: {
					id_str: "retweeted-id"
				}
			}, channel);

			expect(send.calledOnce).to.be.true;

			const { embed } = send.getCall(0).args[0];

			expect(embed.title).to.equal("CodeSupport Twitter");
			expect(embed.description).to.equal("RT @user: This is my tweet\n\nhttps://twitter.com/codesupportdev/status/retweeted-id");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});