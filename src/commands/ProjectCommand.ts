import {Discord, Slash, SlashOption} from "discordx";
import {ColorResolvable, CommandInteraction, MessageEmbed} from "discord.js";
import Project from "../interfaces/Project";
import projects from "../src-assets/projects.json";
import StringUtils from "../utils/StringUtils";
import getConfigValue from "../utils/getConfigValue";
import GenericObject from "../interfaces/GenericObject";

@Discord()
class ProjectCommand {
	private readonly defaultSearchTags = ["easy", "medium", "hard"];

	readonly provideProjects: () => Array<Project> = () => projects;

	@Slash("project")
	async onInteract(
		@SlashOption("query", {type: "STRING"}) queryString: string,
			interaction: CommandInteraction): Promise<void> {
		const embed = new MessageEmbed();

		const query = queryString.split(" ").map((arg: string) => arg.toLowerCase()).filter((arg: string) => arg.trim().length > 0);
		const usageDescription = `Use a difficulty or try out a tag to find a random project! The available difficulties are ${this.defaultSearchTags.map(tag => `\`${tag}\``).join(", ")}. A possible tag to use can be \`frontend\`, \`backend\`, \`spa\`, etc.`;

		if (query.length === 0) {
			embed.setTitle("Error");
			embed.setDescription("You must provide a search query/tag.");
			embed.addField("Usage", usageDescription);
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").ERROR);
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
				embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT);
			} else {
				embed.setTitle("Error");
				embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").ERROR);
				embed.setDescription("Could not find a project result for the given query.");
				embed.addField("Usage", usageDescription);
			}
		}

		await interaction.reply({embeds: [embed]});
	}

	private readonly removeTooLongDescriptions: (project: Project) => boolean = ({description}) => description.length <= 2048;

	private readonly filterTags: (project: Project, requestedTags: Array<string>) => boolean =
		({tags}, requestedTags: Array<string>) => requestedTags.every(tag => tags.includes(tag));

	private readonly retrieveFirstFoundTag: (project: Project, tagsToRetrieve: Array<string>) => string | undefined =
		({tags}, tagsToRetrieve: Array<string>) => tagsToRetrieve.filter(tag => tags.map((tag: string) => tag.toLowerCase()).includes(tag)).pop();
}
export default ProjectCommand;