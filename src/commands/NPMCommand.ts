import axios from "axios";
import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";

class NPMCommand extends Command {
	constructor() {
		super(
			"npm",
			"Displays a link to a given NPM package.",
		);
	}

	async run(message: Message, args: string[]) {
		const embed = new MessageEmbed();
		const packageName = args[0];

		if (!packageName || typeof packageName === "undefined") {
			embed.setTitle("Error");
			embed.setDescription("You must provide a NPM package.");
			embed.addField("Correct Usage", "?npm <package>");

			await message.channel.send({ embed });
		} else {
			try {
				const url = `https://www.npmjs.com/package/${packageName}`;
				const { status } = await axios.get(url);

				if (status === 200) {
					await message.channel.send(url);
				}
			} catch (error) {
				embed.setTitle("Error");
				embed.setDescription("That is not a valid NPM package.");

				await message.channel.send({ embed });
			}
		}
	}
}

export default NPMCommand;
