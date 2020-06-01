import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";
import InstantAnswerService from "../services/InstantAnswerService";

class MDNCommand extends Command {
	private instantAnswer: InstantAnswerService;

	constructor() {
		super(
			"mdn",
			"Get a link to a specific MDN page."
		);

		this.instantAnswer = InstantAnswerService.getInstance();
	}

	async run(message: Message, args?: string[]): Promise<void> {
		const embed = new MessageEmbed();

		if (!args || typeof args[0] === "undefined") {
			embed.setTitle("Error");
			embed.setDescription("You must define a search query.");
			embed.addField("Correct Usage", "?mdn <query>");
		} else {
			try {
				const res = await this.instantAnswer.query(args.join("+"));

				if (res) {
					embed.setTitle(`MDN: ${res.heading}`);
					embed.setDescription(`${res.description}\n\n[View on MDN](${res.url})`);
					embed.setFooter("Result powered by the DuckDuckGo API.");
				} else {
					embed.setTitle("Error");
					embed.setDescription("No results found.");
				}
			} catch ({ message }) {
				console.log(message);

				embed.setTitle("Error");
				embed.setDescription("There was a problem querying MDN.");
				embed.addField("Correct Usage", "?mdn <query>");
			}
		}

		await message.channel.send({ embed });
	}
}

export default MDNCommand;