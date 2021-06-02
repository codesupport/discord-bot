import {Message} from "discord.js";
import Command from "../abstracts/Command";

class WebsiteCommand extends Command {
	constructor() {
		super(
			"duck",
			"Helps other people use duckduckgo to search for answers.",
			{
				aliases: ["ddg", "lmddgtfy"]
			}
		);
	}

	async run(message: Message, args: string[]) {
		if (args.length === 0) return;
		await message.channel.send(`https://lmddgtfy.net/?q=${args.join("%20")}`);
	}
}

export default WebsiteCommand;
