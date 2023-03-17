import {Events, EmbedBuilder, Message, User, ColorResolvable, ChannelType} from "discord.js";
import DateUtils from "../../utils/DateUtils";
import EventHandler from "../../abstracts/EventHandler";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";

class GhostPingDeleteHandler extends EventHandler {
	constructor() {
		super(Events.MessageDelete);
	}

	async handle(message: Message): Promise<void> {
		if (message.mentions.users.first() || message.mentions.roles.first()) {
			if (!message.author?.bot) {
				const usersMentioned = message.mentions.users;

				if (usersMentioned.every(user => user.id === message.author.id || user.bot)) return;

				const embed = new EmbedBuilder();

				let repliedToMessage : Message | null | undefined = null;
				let repliedToUser: User | null | undefined = null;

				if (message.reference?.messageId && message.reference.guildId === message.guild?.id) {
					const repliedToChannel = message.guild?.channels.resolve(message.reference.channelId);

					if (repliedToChannel?.type === ChannelType.GuildText) {
						repliedToMessage = await repliedToChannel.messages.fetch(message.reference.messageId);
						repliedToUser = repliedToMessage?.author;
					}
				}

				embed.setTitle("Ghost Ping Detected!");

				if (repliedToUser !== null && repliedToUser !== undefined) {
					embed.addFields([
						{ name: "Author", value: message.author.toString(), inline: true },
						{ name: "Reply to", value: repliedToUser.toString(), inline: true }
					]);
				} else {
					embed.addFields([{ name: "Author", value: message.author.toString() }]);
				}

				embed.addFields([{ name: "Message", value: message.content }]);

				if (repliedToMessage !== null && repliedToMessage !== undefined && repliedToMessage !== null) {
					embed.addFields([
						{
							name: "Message replied to",
							value: `https://discord.com/channels/${repliedToMessage.guild?.id}/${repliedToMessage.channel.id}/${repliedToMessage.id}`,
							inline: true
						}
					]);
				}

				embed.setFooter({ text: `Message sent at ${DateUtils.formatAsText(message.createdAt)}` });
				embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT);

				await message.channel.send({embeds: [embed]});
			}
		}
	}
}

export default GhostPingDeleteHandler;
