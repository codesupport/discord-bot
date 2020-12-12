import {Message} from "discord.js";
import Command from "../abstracts/Command";

class WebsiteCommand extends Command {
	constructor() {
		super(
			"website",
			"displays the website with given parameter",
			{
				aliases: ["web"]
			}
		);
	}

	async run(message: Message, args: string[]) {
		await message.channel.send(`https://codesupport.dev/${args[0]}`);
	}
}

export default WebsiteCommand;
