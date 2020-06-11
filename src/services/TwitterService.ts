import { Client as DiscordClient, MessageEmbed, TextChannel } from "discord.js";
import Twitter from "twitter";
import { GENERAL_CHANNEL_ID, TWITTER_ID } from "../config.json";

class TwitterService {
	private static instance: TwitterService;
	private twitter: Twitter;

	private constructor() {
		this.twitter = new Twitter({
			consumer_key: "Gb4O5QEKC7DP5AyLmchTi9TqR",
			consumer_secret: "2xZm53RKLk183rBvcDFIwMi6eBH7yVZZSkQxtJdKKMW6xcv2ts",
			access_token_key: "3715628177-U7DHGharkISyxHBtVs2qg1eOggfwoVTrRZ7kFx2",
			access_token_secret: "I9reFFZbHe2tW1eZnt2122aeWgeZeknErRlxWm3jCDKbm"
		})
	}

	static getInstance(): TwitterService {
		if (!this.instance) {
			this.instance = new TwitterService();
		}

		return this.instance;
	}

	async streamToDiscord(client: DiscordClient): Promise<void> {
		const tweetChannel = await client.channels.fetch(GENERAL_CHANNEL_ID) as TextChannel;

		this.twitter.stream("statuses/filter", {
			follow: TWITTER_ID
		}).on("data", ({ id_str: id, text }) => {
			if (!text.startsWith("@")) {
				const url = `https://twitter.com/codesupportdev/status/${id}`;

				const embed = new MessageEmbed();

				embed.setTitle("CodeSupport Twitter");
				embed.setDescription(`${text}\n\n${url}`);

				tweetChannel.send({ embed });
			}
		});
	}
}

export default TwitterService;