import { Message, TextChannel, MessageEmbed } from "discord.js";
import DiscordUtils from "../utils/DiscordUtils";

class MessagePreviewService {
	private static instance: MessagePreviewService;

	/* eslint-disable */
	private constructor() {}
	/* eslint-enable */

	static getInstance(): MessagePreviewService {
		if (!this.instance) {
			this.instance = new MessagePreviewService();
		}

		return this.instance;
	}

	async generatePreview(link: string, callingMessage: Message): Promise<void> {
		const msgArray = this.stripLink(link);

		if (this.verifyGuild(callingMessage, msgArray[0])) {
			if (callingMessage.guild?.available) {
				const channel = callingMessage.guild.channels.cache.get(msgArray[1]) as TextChannel;
				const messageToPreview = await channel.messages.fetch(msgArray[2]);

				if (!DiscordUtils.wasSentByABot(messageToPreview)) {
					const embed = new MessageEmbed();

					embed.setAuthor(this.getAuthorName(messageToPreview), messageToPreview.author.avatarURL() || undefined, link);
					embed.addField(`Called by ${this.getAuthorName(callingMessage)}`, `[Click for context](${link})`);
					embed.setDescription(`${messageToPreview.content}\n`);
					embed.setColor(messageToPreview.member?.displayColor || "#FFFFFE");

					callingMessage.channel.send(embed);
				}
			}
		}
	}

	getAuthorName(message: Message) {
		return message.member?.nickname || message.author.username;
	}

	verifyGuild(message: Message, guildId: string): boolean {
		return guildId === message.guild?.id;
	}

	stripLink(link: string): string[] {
		return link.substring(29).split("/");
	}
}

export default MessagePreviewService;