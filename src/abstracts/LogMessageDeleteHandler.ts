import {MessageEmbed, Message, TextChannel, ColorResolvable} from "discord.js";
import EventHandler from "./EventHandler";
import getConfigValue from "../utils/getConfigValue";
import GenericObject from "../interfaces/GenericObject";

abstract class LogMessageDeleteHandler extends EventHandler {
	async sendLog(message: Message): Promise<void> {
		if (message.content !== "") {
			const embed = new MessageEmbed();

			embed.setTitle("Message Deleted");
			embed.setDescription(`Author: ${message.author}\nChannel: ${message.channel}`);
			embed.addField("Message", message.content);
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT);

			const logsChannel = message.guild?.channels.cache.find(
				channel => channel.id === getConfigValue<string>("LOG_CHANNEL_ID")
			) as TextChannel;

			await logsChannel?.send({ embeds: [embed] });
		}
	}
}

export default LogMessageDeleteHandler;
