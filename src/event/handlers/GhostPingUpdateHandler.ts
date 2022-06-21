import {Constants, MessageEmbed, Message, ColorResolvable} from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import DateUtils from "../../utils/DateUtils";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";

class GhostPingUpdateHandler extends EventHandler {
	constructor() {
		super(Constants.Events.MESSAGE_UPDATE);
	}

	async handle(oldMessage: Message, newMessage: Message): Promise<void> {
		if (oldMessage.author?.bot) return;

		const oldMentionedUsers = oldMessage.mentions.users;

		if (oldMentionedUsers.size === 0 || oldMentionedUsers.every(user => user.id === oldMessage.author.id || user.bot)) return;

		const removedMentions = oldMentionedUsers.filter(user => {
			for (const [, newUser] of newMessage.mentions.users) {
				if (user.id === newUser.id) {
					return false;
				}
			}

			return true;
		});

		if (removedMentions.size === 0 || removedMentions.every(user => user.id === oldMessage.author.id || user.bot)) return;

		const embed = new MessageEmbed();

		embed.setTitle("Ghost Ping Detected!");
		embed.addField("Author", oldMessage.author.toString());
		embed.addField("Previous message", oldMessage.content);
		embed.addField("Edited message", newMessage.content);
		embed.addField("Link to message", newMessage.url);
		embed.setFooter({ text: `Message edited on ${DateUtils.formatAsText(newMessage.createdAt)}` });
		embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT);

		await oldMessage.channel.send({embeds: [embed]});
	}
}

export default GhostPingUpdateHandler;
