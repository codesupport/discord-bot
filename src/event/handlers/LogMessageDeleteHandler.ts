import { Constants, MessageEmbed, Message, TextChannel } from "discord.js";
import { LOG_CHANNEL_ID, EMBED_COLOURS } from "../../config.json";
import EventHandler from "../../abstracts/EventHandler";

class LogMessageDeleteHandler extends EventHandler {
	constructor() {
		super(Constants.Events.MESSAGE_DELETE);
	}

	async handle(message: Message): Promise<void> {
		if (message.content !== "") {
			const embed = new MessageEmbed();

			embed.setTitle("Message Deleted");
			embed.setDescription(`Author: <@${message.author}>\nChannel: <#${message.channel}>`);
			embed.addField("Message", message.content);
			embed.setColor(EMBED_COLOURS.DEFAULT);

			const logsChannel = message.guild?.channels.cache.find(channel => channel.id === LOG_CHANNEL_ID) as TextChannel;

			await logsChannel?.send({ embed });
		}
	}
}

export default LogMessageDeleteHandler;