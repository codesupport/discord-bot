import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";
import InstantAnswerService from "../services/InstantAnswerService";
import { EMBED_COLOURS } from "../config.json";

class SearchCommand extends Command {
	constructor() {
		super(
			"search",
			"Query DuckDuckGo for an instant answer."
		);
	}

	async run(message: Message, args?: string[]): Promise<void> {
		const embed = new MessageEmbed();

		if (!args || typeof args[0] === "undefined") {
			embed.setTitle("Error");
			embed.setDescription("You must define a search query.");
			embed.addField("Correct Usage", "?search <query>");
			embed.setColor(EMBED_COLOURS.ERROR);
		} else {
			try {
				const InstantAnswer = InstantAnswerService.getInstance();
				const res = await InstantAnswer.query(args.join("+"));

				if (res !== null) {
					const [baseURL] = res.url.match(/[a-z]*\.[a-z]*(\.[a-z]*)*/) || [];

					embed.setTitle(res.heading);
					embed.setDescription(`${res.description}\n\n[View on ${baseURL}](${res.url})`);
					embed.setFooter("Result powered by the DuckDuckGo API.");
					embed.setColor(EMBED_COLOURS.SUCCESS);
				} else {
					embed.setTitle("Error");
					embed.setDescription("No results found.");
					embed.setColor(EMBED_COLOURS.ERROR);
				}
			} catch (error) {
				embed.setTitle("Error");
				embed.setDescription("There was a problem querying DuckDuckGo.");
				embed.addField("Correct Usage", "?search <query>");
				embed.setColor(EMBED_COLOURS.ERROR);
			}
		}

		await message.channel.send({ embeds: [embed] });
	}
}

export default SearchCommand;