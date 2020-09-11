import { Constants, MessageEmbed, Message } from "discord.js";
import { EMBED_COLOURS } from "../../config.json";
import EventHandler from "../../abstracts/EventHandler";

class GhostPingHandler extends EventHandler {
	constructor() {
		super(Constants.Events.MESSAGE_DELETE);
	}

	async handle(message: Message): Promise<void> {
		if (message.mentions.users.first() || message.mentions.roles.first()) {
			if (!message.author?.bot) {
				const embed = new MessageEmbed();

				embed.setTitle("Ghost Ping Detected!");
				embed.addField("Author", message.author);
				embed.addField("Message", message.content);
				embed.setColor(EMBED_COLOURS.DEFAULT);

				await message.channel.send(embed);
			}
		}
	}
}

export default GhostPingHandler;