import {Events, ButtonStyle, EmbedBuilder, Message, ColorResolvable, ActionRowBuilder, ButtonBuilder} from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import DateUtils from "../../utils/DateUtils";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";

class GhostPingUpdateHandler extends EventHandler {
	constructor() {
		super(Events.MessageUpdate);
	}

	async handle(oldMessage: Message, newMessage: Message): Promise<void> {
		if (oldMessage.author?.bot) return;

		const removedMentions = oldMessage.mentions.users.filter(user => !newMessage.mentions.users.has(user.id));

		if (removedMentions.size === 0 || removedMentions.every(user => user.id === oldMessage.author.id || user.bot)) return;

		const button = new ButtonBuilder();

		button.setLabel("View Edited Message");
		button.setStyle(ButtonStyle.Link);
		button.setURL(newMessage.url);

		const row = new ActionRowBuilder().addComponents(button);
		const embed = new EmbedBuilder();

		embed.setTitle("Ghost Ping Detected!");
		embed.addFields([
			{ name: "Author", value: oldMessage.author.toString() },
			{ name: "Previous message", value: oldMessage.content },
			{ name: "Edited message", value: newMessage.content }
		]);
		embed.setFooter({ text: `Message edited at ${DateUtils.formatAsText(newMessage.createdAt)}` });
		embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT);

		await oldMessage.channel.send({embeds: [embed], components: [row]});
	}
}

export default GhostPingUpdateHandler;
