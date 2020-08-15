import { Message } from "discord.js";
import Command from "../abstracts/Command";

class ResourcesCommand extends Command {
	constructor() {
		super(
			"resources",
			"Displays a link to the resources page of CodeSupport's website.",
			{
				aliases: ["resource"]
			}
		);
	}

	async run(message: Message, args: string[]) {
		let url = "https://codesupport.dev/resources";
		const [category] = args;

		if (category) {
			url += `?category=${category}`;
		}

		await message.channel.send(url);
	}
}

export default ResourcesCommand;
