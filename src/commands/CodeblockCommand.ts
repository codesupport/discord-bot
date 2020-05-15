import { Message, MessageEmbed, MessageAttachment } from "discord.js";
import Command from "../abstracts/Command";

class CodeblockCommand extends Command {
	constructor() {
		super(
			"codeblock",
			"Shows a tutorial on how to use Discord's codeblocks.",
			{
				selfDestructing: true
			}
		);
	}

	async run(message: Message, args: string[]): Promise<void> {
		const embed = new MessageEmbed();
		const image = new MessageAttachment("./assets/codeblock.png", "codeblock-tutorial.png");

		embed.setTitle("Codeblock Tutorial");
		embed.setDescription("Please use codeblocks when sending code.");
		embed.addField("Sending lots of code?", "Consider using a [GitHub Gist](http://gist.github.com).");
		embed.attachFiles([image]);
		embed.setImage("attachment://codeblock-tutorial.png");

		await message.channel.send({ embed });
	}
}

export default CodeblockCommand;
