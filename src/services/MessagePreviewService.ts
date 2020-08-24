import { Message, TextChannel, MessageEmbed } from "discord.js";

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

				if (!this.wasSentByABot(messageToPreview)) {
					const embed = new MessageEmbed();

					embed.setAuthor(messageToPreview.member?.nickname || messageToPreview.author.username, messageToPreview.author.avatarURL() || undefined, link);
					embed.addField(`Called by ${callingMessage.member?.nickname || callingMessage.author.username}`, `[Click for context](${link})`);
					embed.setDescription(`${messageToPreview.content}\n`);
					embed.setColor(messageToPreview.member?.displayColor || "#FFFFFE");

					callingMessage.channel.send(embed);
				}
			}
		}
	}

	verifyGuild(message: Message, guildId: string): boolean {
		return guildId === message.guild?.id;
	}

	stripLink(link: string): string[] {
		return link.substring(29).split("/");
	}

	wasSentByABot(message: Message): boolean {
		return message.author?.bot;
	}
}

export default MessagePreviewService;