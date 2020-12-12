import {Message} from "discord.js";
import Command from "../abstracts/Command";

class WebsiteCommand extends Command {
	constructor() {
		super(
			"website",
			"Displays the website with given parameter",
			{
				aliases: ["web"]
			}
		);
	}

	async run(message: Message, args: string[]) {
		if (args[0] === undefined || args[0] === null) args[0] = "";
		await message.channel.send(`https://codesupport.dev/${args[0]}`);
	}
}

export default WebsiteCommand;
