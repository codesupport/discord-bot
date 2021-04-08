import Command from "../abstracts/Command";
import {Message, MessageEmbed} from "discord.js";
import {readFile} from "fs";

export default class ProjectCommand extends Command {
	private readonly fileDirectory = "./assets/projects.json";

	constructor() {
		super(
			"project",
			"Returns a random project idea based on given parameters."
		);
	}

	async run(message: Message, args: string[]): Promise<void> {
		const embed = new MessageEmbed();
		const query = args.map(arg => arg.toLowerCase()).filter(arg => arg.trim().length > 0);

		if (args.length === 0) {
			embed.setTitle("Projects");
			embed.setColor("#add8e6");
			embed.setDescription("Please provide arguments on the projects command.");
			await message.channel.send(embed);
		} else {
			readFile(`${this.fileDirectory}`, {encoding: "utf8"}, async (error, projectData) => {
				const projects: Array<Project> = JSON.parse(projectData);
				const project = projects
					.filter(this.removeTooLongDescriptions)
					.filter(project => this.filterTags(project, query))
					.sort(() => 0.5 - Math.random()).pop();

				if (project) {
					const difficulty = this.retrieveFirstFoundTag(project, ["easy", "medium", "hard"]);

					embed.setColor(this.loadDifficultyColorMap().get(difficulty || "") || "#add8e6");
					embed.setTitle(project.title);
					embed.addFields({name: "tags", value: project.tags.join(" ")});
					embed.addField("Project details", project.description);
				} else {
					embed.setTitle("Could not find a project");
					embed.setColor("#bc3131");
					embed.setDescription("try to enter less search arguments to broaden your search.");
				}
				await message.channel.send(embed);
			});
		}
	}

	private readonly loadDifficultyColorMap: () => Map<string, string> = () => new Map([["easy", "#35BC31"], ["medium", "#ffa500"], ["hard", "#bc3131"]]);

	private readonly removeTooLongDescriptions: (project: Project) => boolean = ({description}) => description.length <= 2048;

	private readonly filterTags: (project: Project, requestedTags: Array<string>) => boolean =
		({tags}, requestedTags: Array<string>) => requestedTags.every(tag => tags.includes(tag));

	private readonly retrieveFirstFoundTag: (project: Project, tagsToRetrieve: Array<string>) => string | undefined =
		({tags}, tagsToRetrieve: Array<string>) => tagsToRetrieve.filter(tag => tags.map(tag => tag.toLowerCase()).includes(tag)).pop();
}
