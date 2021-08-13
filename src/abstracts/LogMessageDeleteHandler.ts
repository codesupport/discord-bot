import {MessageEmbed, Message, TextChannel, ColorResolvable} from "discord.js";
import { LOG_CHANNEL_ID, EMBED_COLOURS } from "../config.json";
import EventHandler from "./EventHandler";

abstract class LogMessageDeleteHandler extends EventHandler {
	async sendLog(message: Message): Promise<void> {
		if (message.content !== "") {
			const embed = new MessageEmbed();

			embed.setTitle("Message Deleted");
			embed.setDescription(`Author: ${message.author}\nChannel: ${message.channel}`);
			embed.addField("Message", message.content);
			embed.setColor(<ColorResolvable>EMBED_COLOURS.DEFAULT);

			const logsChannel = message.guild?.channels.cache.find(channel => channel.id === LOG_CHANNEL_ID) as TextChannel;

			await logsChannel?.send({ embeds: [embed] });
		}
	}
}

export default LogMessageDeleteHandler;
