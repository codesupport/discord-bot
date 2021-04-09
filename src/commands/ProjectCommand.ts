import Command from "../abstracts/Command";
import { Message, MessageEmbed } from "discord.js";
import { EMBED_COLOURS } from "../config.json";
import Project from "../interfaces/Project";
import projects from "../src-assets/projects.json";
import StringUtils from "../utils/StringUtils";

export default class ProjectCommand extends Command {
	private readonly defaultSearchTags = ["easy", "medium", "hard"];

	constructor() {
		super(
			"project",
			"Returns a random project idea based on given parameters.",
			{
				aliases: ["projects"]
			}
		);
	}

	readonly provideProjects: () => Array<Project> = () => projects;

	async run(message: Message, args: string[]): Promise<void> {
		const embed = new MessageEmbed();

		const query = args.map((arg: string) => arg.toLowerCase()).filter((arg: string) => arg.trim().length > 0);

		if (args.length === 0) {
			embed.setTitle("Error");
			embed.setDescription("You must provide a search query/tag.");
			embed.addField("Correct Usage", "?projects <query>");
			embed.setColor(EMBED_COLOURS.ERROR);
		} else {
			const displayProject = this.provideProjects()
				.filter(this.removeTooLongDescriptions)
				.filter(project => this.filterTags(project, query))
				.sort(() => 0.5 - Math.random()).pop();

			if (displayProject) {
				const difficulty = this.retrieveFirstFoundTag(displayProject, this.defaultSearchTags);

				embed.setTitle(`Project: ${displayProject.title}`);
				embed.setDescription(displayProject.description);
				if (difficulty) embed.addField("Difficulty", StringUtils.capitalise(difficulty), true);
				embed.addField("Tags", displayProject.tags.map(tag => `#${tag}`).join(", "), true);
				embed.setColor(EMBED_COLOURS.DEFAULT);
			} else {
				embed.setTitle("Error");
				embed.setColor(EMBED_COLOURS.ERROR);
				embed.setDescription("Could not find a project result for the given query.");
			}
		}

		await message.channel.send(embed);
	}

	private readonly removeTooLongDescriptions: (project: Project) => boolean = ({description}) => description.length <= 2048;

	private readonly filterTags: (project: Project, requestedTags: Array<string>) => boolean =
		({tags}, requestedTags: Array<string>) => requestedTags.every(tag => tags.includes(tag));

	private readonly retrieveFirstFoundTag: (project: Project, tagsToRetrieve: Array<string>) => string | undefined =
		({tags}, tagsToRetrieve: Array<string>) => tagsToRetrieve.filter(tag => tags.map((tag: string) => tag.toLowerCase()).includes(tag)).pop();
}
