import { ColorResolvable, CommandInteraction, EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { injectable as Injectable } from "tsyringe";
import GitHubService from "../services/GitHubService";
import GitHubIssue from "../interfaces/GitHubIssue";
import DateUtils from "../utils/DateUtils";
import StringUtils from "../utils/StringUtils";
import getConfigValue from "../utils/getConfigValue";
import GenericObject from "../interfaces/GenericObject";

@Discord()
@Injectable()
class IssuesCommand {
	constructor(
		private readonly gitHubService: GitHubService
	) {}

	@Slash({ name: "issues", description: "Shows the open issues on a GitHub repository" })
	async onInteract(
		@SlashOption({ name: "user", description: "Github user/account", type: ApplicationCommandOptionType.String, required: true }) user: string,
		@SlashOption({ name: "repository", description: "Github repository", type: ApplicationCommandOptionType.String, required: true }) repoName: string,
			interaction: CommandInteraction
	): Promise<void> {
		const embed = new EmbedBuilder();

		try {
			const resIssues = await this.gitHubService.getIssues(user, repoName);
			const resRep = await this.gitHubService.getRepository(user, repoName);

			if (resIssues.length) {
				const issues = resIssues.slice(0, 3);

				embed.setTitle(`GitHub Issues: ${user}/${repoName}`);
				embed.setDescription(`${resRep.description}\n\n[View Issues on GitHub](${resRep.url}/issues) - [Create An Issue](${resRep.url}/issues/new)`);

				issues.forEach((issue: GitHubIssue) => {
					const days = DateUtils.getDaysBetweenDates(new Date(Date.now()), issue.created_at);
					const daysText = StringUtils.capitalise(DateUtils.formatDaysAgo(days));

					embed.addFields([
						{
							name: `#${issue.number} - ${issue.title}`,
							value: `View on [GitHub](${issue.issue_url}) - ${daysText} by [${issue.author}](${issue.author_url})`
						}
					]);
				});

				embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").SUCCESS);
			} else {
				embed.setTitle("No Issues found");
				embed.setDescription(`This repository has no issues. [Create one](${resRep.url}/issues/new)`);
				embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").SUCCESS);
			}
		} catch (error) {
			embed.setTitle("Error");
			embed.setDescription("There was a problem with the request to GitHub.");
			embed.addFields([{ name: "Correct Usage", value: "/issues <username>/<repository>" }]);
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").ERROR);
		}
		await interaction.reply({ embeds: [embed] });
	}
}

export default IssuesCommand;
