import { Client as DiscordClient, MessageEmbed, TextChannel } from "discord.js";
import Twitter from "twitter";
import { GENERAL_CHANNEL_ID, TWITTER_ID } from "../config.json";
import TwitterStreamListener from "../interfaces/TwitterStreamListener";
import getEnvironmentVariable from "../utils/getEnvironmentVariable";

class TwitterService {
	private static instance: TwitterService;
	private twitter: Twitter;
	private tweetChannel: TextChannel | undefined;

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

	streamToDiscord = async (client: DiscordClient): Promise<void> => {
		this.tweetChannel = await client.channels.fetch(GENERAL_CHANNEL_ID) as TextChannel;

		this.twitter.stream("statuses/filter", {
			follow: TWITTER_ID
		}).on("data", this.handleTwitterStream);
	}

	handleTwitterStream = async ({ id_str: id, text }: TwitterStreamListener): Promise<void> =>  {
		if (!text.startsWith("@")) {
			const url = `https://twitter.com/codesupportdev/status/${id}`;

			const embed = new MessageEmbed();

			embed.setTitle("CodeSupport Twitter");
			embed.setDescription(`${text}\n\n${url}`);

			await this.tweetChannel?.send({embed});
		}
	}
}

export default TwitterService;