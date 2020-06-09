import { Constants, MessageEmbed, Message, TextChannel } from "discord.js";
import { LOG_CHANNEL_ID } from "../../config.json";
import EventHandler from "../../abstracts/EventHandler";

class LogMessageUpdateHandler extends EventHandler {
    constructor() {
        super(Constants.Events.MESSAGE_DELETE);
    }

    async handle(message: Message): Promise<void> {
        const embed = new MessageEmbed();

        embed.setTitle("Message Deleted");
        embed.setDescription(`Author: <@${message.author}>\nChannel: <#${message.channel}>`);
        embed.addField("Message", message.content);

        const logsChannel = message.guild?.channels.cache.find(channel => channel.id === LOG_CHANNEL_ID) as TextChannel;

        await logsChannel?.send({ embed });
    }
}

export default LogMessageUpdateHandler;