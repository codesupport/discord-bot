import { Events, EmbedBuilder, Message, TextChannel, ColorResolvable } from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";
import { logger } from "../../logger";

class LogMessageUpdateHandler extends EventHandler {
	constructor() {
		super(Events.MessageUpdate);
	}

	async handle(oldMessage: Message, newMessage: Message): Promise<void> {
		if (oldMessage.content === newMessage.content) {
			return;
		}

		if (newMessage.content === "") {
			return;
		}

		try {
			const embed = new EmbedBuilder();

			embed.setTitle("Message Updated");
			embed.setDescription(`Author: ${oldMessage.author}\nChannel: ${oldMessage.channel}`);
			embed.addFields([
				{ name: "Old Message", value: oldMessage.content },
				{ name: "New Message", value: newMessage.content }
			]);
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT);

			const logsChannel = oldMessage.guild?.channels.cache.find(
				channel => channel.id === getConfigValue<string>("LOG_CHANNEL_ID")
			) as TextChannel;

			await logsChannel?.send({embeds: [embed]});
		} catch (error) {
			logger.error("Failed to send message update log", {
				messageId: oldMessage.id,
				channelId: oldMessage.channelId
			});
		}
	}
}

export default LogMessageUpdateHandler;
