import { MessageEmbed, TextChannel } from "discord.js";
import Twitter from "twitter";
import { TWITTER_ID, EMBED_COLOURS, LOG_CHANNEL_ID } from "../config.json";
import TwitterStreamListener from "../interfaces/TwitterStreamListener";
import getEnvironmentVariable from "../utils/getEnvironmentVariable";

class TwitterService {
	private static instance: TwitterService;
	private twitter: Twitter;

	private constructor() {
		this.twitter = new Twitter({
			consumer_key: getEnvironmentVariable("TWITTER_CONSUMER_KEY"),
			consumer_secret: getEnvironmentVariable("TWITTER_CONSUMER_SECRET"),
			access_token_key: getEnvironmentVariable("TWITTER_ACCESS_KEY"),
			access_token_secret: getEnvironmentVariable("TWITTER_ACCESS_SECRET")
		});
	}

	static getInstance(): TwitterService {
		if (!this.instance) {
			this.instance = new TwitterService();
		}

		return this.instance;
	}

	streamToDiscord = async (tweetChannel: TextChannel): Promise<void> => {
		this.twitter.stream("statuses/filter", {
			follow: TWITTER_ID
		}).on("data", listener => {
			console.log(listener);
			return this.handleTwitterStream(listener, tweetChannel);
		});
	}

	handleTwitterStream = async ({ id_str: id, text, extended_tweet }: TwitterStreamListener, tweetChannel: TextChannel): Promise<void> => {
		const embed = new MessageEmbed();
		let tweet = text;

		if (extended_tweet) {
			tweet = extended_tweet.full_text;
		}

		if (!tweet.startsWith("@")) {
			const url = `https://twitter.com/codesupportdev/status/${id}`;

			embed.setTitle("CodeSupport Twitter");
			embed.setDescription(`${tweet.toString()}\n\n${url}`);
			embed.setColor(EMBED_COLOURS.DEFAULT);

			await tweetChannel.send({ embed });
		}
	}
}

export default TwitterService;