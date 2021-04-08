import Command from "../abstracts/Command";
import {Message, MessageEmbed} from "discord.js";
// @ts-ignore
import projects from "../../assets/projects.json";
import Project from "../interfaces/Project";

export default class ProjectCommand extends Command {
	private readonly defaultSearchTags = ["easy", "medium", "hard"];

	constructor() {
		super(
			"project",
			"Returns a random project idea based on given parameters."
		);
	}

	readonly provideProjects: () => Array<Project> = () => projects;

	async run(message: Message, args: string[]): Promise<void> {
		const embed = new MessageEmbed();

		const query = args.map((arg: string) => arg.toLowerCase()).filter((arg: string) => arg.trim().length > 0);

		if (args.length === 0) {
			embed.setTitle("Projects");
			embed.setColor("#add8e6");
			embed.setDescription("Please provide arguments on the projects command.");
		} else {
			const displayProject = this.provideProjects()
				.filter(this.removeTooLongDescriptions)
				.filter(project => this.filterTags(project, query))
				.sort(() => 0.5 - Math.random()).pop();

			if (displayProject) {
				const difficulty = this.retrieveFirstFoundTag(displayProject, this.defaultSearchTags);

				embed.setColor(this.loadDifficultyColorMap().get(difficulty || "") || "#add8e6");
				embed.setTitle(displayProject.title);
				embed.addFields({name: "tags", value: displayProject.tags.join(" ")});
				embed.addField("Project details", displayProject.description);
			} else {
				embed.setTitle("Could not find a project");
				embed.setColor("#bc3131");
				embed.setDescription("try to enter less search arguments to broaden your search.");
			}
		}
		await message.channel.send(embed);
	}

	private readonly loadDifficultyColorMap: () => Map<string, string> = () => new Map([["easy", "#35BC31"], ["medium", "#ffa500"], ["hard", "#bc3131"]]);

	private readonly removeTooLongDescriptions: (project: Project) => boolean = ({description}) => description.length <= 2048;

	private readonly filterTags: (project: Project, requestedTags: Array<string>) => boolean =
		({tags}, requestedTags: Array<string>) => requestedTags.every(tag => tags.includes(tag));

	private readonly retrieveFirstFoundTag: (project: Project, tagsToRetrieve: Array<string>) => string | undefined =
		({tags}, tagsToRetrieve: Array<string>) => tagsToRetrieve.filter(tag => tags.map((tag: string) => tag.toLowerCase()).includes(tag)).pop();
}
