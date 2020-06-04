import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";
import InstantAnswerService from "../services/InstantAnswerService";

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
		} else {
			try {
				const InstantAnswer = InstantAnswerService.getInstance();
				const res = await InstantAnswer.query(args.join("+"));

				if (res) {
					const [baseURL] = res.url.match(/[a-z]*\.[a-z]*/) || [];

					embed.setTitle(res.heading);
					embed.setDescription(`${res.description}\n\n[View on ${baseURL}](${res.url})`);
					embed.setFooter("Result powered by the DuckDuckGo API.");
				} else {
					embed.setTitle("Error");
					embed.setDescription("No results found.");
				}
			} catch (error) {
				embed.setTitle("Error");
				embed.setDescription("There was a problem querying DuckDuckGo.");
				embed.addField("Correct Usage", "?search <query>");
			}
		}

		await message.channel.send({ embed });
	}
}

export default SearchCommand;