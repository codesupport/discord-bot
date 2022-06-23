import {Constants, MessageEmbed, Message, ColorResolvable, MessageActionRow, MessageButton} from "discord.js";
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

		const removedMentions = oldMessage.mentions.users.filter(user => !newMessage.mentions.users.has(user.id));

		if (removedMentions.size === 0 || removedMentions.every(user => user.id === oldMessage.author.id || user.bot)) return;

		const button = new MessageButton();

		button.setLabel("View Edited Message");
		button.setStyle(Constants.MessageButtonStyles.LINK);
		button.setURL(newMessage.url);

		const row = new MessageActionRow().addComponents(button);
		const embed = new MessageEmbed();

		embed.setTitle("Ghost Ping Detected!");
		embed.addField("Author", oldMessage.author.toString());
		embed.addField("Previous message", oldMessage.content);
		embed.addField("Edited message", newMessage.content);
		embed.setFooter({ text: `Message edited at ${DateUtils.formatAsText(newMessage.createdAt)}` });
		embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT);

		await oldMessage.channel.send({embeds: [embed], components: [row]});
	}
}

export default GhostPingUpdateHandler;
