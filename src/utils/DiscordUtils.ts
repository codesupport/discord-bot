import { Message } from "discord.js";

class DiscordUtils {
	static wasSentByABot(message: Message): boolean {
		return message.author?.bot;
	}
}

export default DiscordUtils;