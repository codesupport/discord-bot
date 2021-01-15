import { Constants, MessageEmbed, Message, User, TextChannel } from "discord.js";
import { EMBED_COLOURS } from "../../config.json";
import DateUtils from "../../utils/DateUtils";
import EventHandler from "../../abstracts/EventHandler";

class GhostPingHandler extends EventHandler {
	constructor() {
		super(Constants.Events.MESSAGE_DELETE);
	}

	async handle(message: Message): Promise<void> {
		if (message.mentions.users.first() || message.mentions.roles.first()) {
			if (!message.author?.bot) {
				const usersMentioned = message.mentions.users;

				if (usersMentioned.first()?.id === message.author.id && usersMentioned.size === 1) return;

				const embed = new MessageEmbed();

				let repliedToMessage : Message | null | undefined = null;
				let repliedToUser: User | null | undefined = null;

				if (message.reference?.messageID && message.reference.guildID === message.guild?.id) {
					const repliedToChannel = message.guild.channels.resolve(message.reference.channelID);

					if (repliedToChannel instanceof TextChannel) {
						repliedToMessage = await repliedToChannel.messages.fetch(message.reference.messageID);
						repliedToUser = repliedToMessage?.author;
					}
				}

				embed.setTitle("Ghost Ping Detected!");

				if (repliedToUser !== null && repliedToUser !== undefined) {
					embed.addField("Author", message.author, true);
					embed.addField("Reply to", repliedToUser, true);
				} else {
					embed.addField("Author", message.author);
				}

				embed.addField("Message", message.content);

				if (repliedToMessage !== null && repliedToMessage !== undefined && repliedToMessage !== null) {
					embed.addField("Message replied to", `https://discord.com/channels/${repliedToMessage.guild?.id}/${repliedToMessage.channel.id}/${repliedToMessage.id}`, true);
				}

				embed.setFooter(`Message sent at ${DateUtils.formatAsText(message.createdAt)}`);
				embed.setColor(EMBED_COLOURS.DEFAULT);

				await message.channel.send(embed);
			}
		}
	}
}

export default GhostPingHandler;
