import { EmbedBuilder, Message, TextChannel, ColorResolvable } from "discord.js";
import EventHandler from "./EventHandler";
import getConfigValue from "../utils/getConfigValue";
import GenericObject from "../interfaces/GenericObject";
import { logger } from "../logger";

abstract class LogMessageDeleteHandler extends EventHandler {
	async sendLog(message: Message): Promise<void> {
		if (message.content !== "") {
			try {
				const embed = new EmbedBuilder();

				embed.setTitle("Message Deleted");
				embed.setDescription(`Author: ${message.author}\nChannel: ${message.channel}`);
				embed.addFields([{ name: "Message", value: message.content }]);
				embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT);

				const logsChannel = message.guild?.channels.cache.find(
					channel => channel.id === getConfigValue<string>("LOG_CHANNEL_ID")
				) as TextChannel;

				await logsChannel?.send({embeds: [embed]});
			} catch (error) {
				logger.error("Failed to send message deletion log", {
					messageId: message.id,
					channelId: message.channelId
				});
			}
		}
	}
}

export default LogMessageDeleteHandler;
