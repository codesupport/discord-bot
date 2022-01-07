import {Message, MessageEmbed, MessageAttachment, ColorResolvable} from "discord.js";
import Command from "../abstracts/Command";
import getConfigValue from "../utils/getConfigValue";
import GenericObject from "../interfaces/GenericObject";

class CodeblockCommand extends Command {
	constructor() {
		super(
			"codeblock",
			"Shows a tutorial on how to use Discord's codeblocks.",
			{
				selfDestructing: true,
				aliases: ["codeblocks", "cb"]
			},
		);
	}

	async run(message: Message, args: string[]): Promise<void> {
		const embed = new MessageEmbed();
		const image = new MessageAttachment("./assets/codeblock.png", "codeblock-tutorial.png");

		embed.setTitle("Codeblock Tutorial");
		embed.setDescription("Please use codeblocks when sending code.");
		embed.addField("Sending lots of code?", "Consider using a [GitHub Gist](http://gist.github.com).");
		embed.setImage("attachment://codeblock-tutorial.png");
		embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT);

		await message.channel.send({ embeds: [embed], files: [image] });
	}
}

export default CodeblockCommand;
