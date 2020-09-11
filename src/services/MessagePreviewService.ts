import { Message, TextChannel, MessageEmbed } from "discord.js";
import DateUtils from "../utils/DateUtils";
import { MEMBER_ROLE_COLOR, FIELD_SPACER_CHARACTER } from "../config.json";

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

				if (!messageToPreview.author?.bot) {
					const embed = new MessageEmbed();
					const parsedContent = this.serializeHyperlinks(messageToPreview.content);

					embed.setAuthor(this.getAuthorName(messageToPreview), messageToPreview.author.avatarURL() || undefined, link);
					embed.setDescription(`${parsedContent}\n`);
					embed.addField(FIELD_SPACER_CHARACTER, `[View Original Message](${link})`);
					embed.setFooter(`Message Sent at ${DateUtils.format(messageToPreview.createdAt)}`);
					embed.setColor(messageToPreview.member?.displayColor || MEMBER_ROLE_COLOR);

					callingMessage.channel.send(embed);
				}
			}
		}
	}

	serializeHyperlinks(content: String): String {
		if (!content) {
			return content;
		}

		return content.replace(/\[[^\[]*\]\([^)]*\)/g, match => {
			const chars = ["[", "]", "(", ")"];
			let output = match;

			for (let i = 0; i < output.length; i++) {
				if (chars.includes(output[i])) {
					output = `${output.slice(0, i)}\\${output.slice(i)}`;
					i++;
				}
			}

			return output;
		});
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