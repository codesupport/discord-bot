import Command from "../abstracts/Command";
import { Message, MessageEmbed } from "discord.js";
import { EMBED_COLOURS } from "../config.json";
import StringUtils from "../utils/StringUtils";
import ProjectService from "../services/ProjectService";

export default class ProjectCommand extends Command {
	constructor() {
		super(
			"project",
			"Returns a random project idea based on given parameters.",
			{
				aliases: ["projects"]
			}
		);
	}

	async run(message: Message, args: string[]): Promise<void> {
		const embed = new MessageEmbed();

		try {
			const projectService = ProjectService.getInstance();
			const tags = projectService.formatTags(args);
			const projectInformation = projectService.getProjectByTags(tags);

			if (projectInformation === null) throw "Error";

			const difficulty = projectService.getDifficulty(projectInformation);

			embed.setTitle(`Project: ${projectInformation.title}`);
			embed.setDescription(projectInformation.description);
			embed.addField("Difficulty", StringUtils.capitalise(difficulty), true);
			embed.addField("Tags", projectInformation.tags.map(tag => `#${tag}`).join(", "), true);
			console.log("Breakpoint 3");
			embed.setColor(EMBED_COLOURS.DEFAULT);
		} catch {
			embed.setTitle("Error");
			embed.setColor(EMBED_COLOURS.ERROR);
			embed.setDescription("Could not find a project result for the given query.");
		}

		await message.channel.send(embed);
	}
}
