import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";
import GitHubService from "../services/GitHubService";
import { EMBED_COLOURS } from "../config.json";
import GitHubIssue from "../interfaces/GitHubIssue";
import DateUtils from "../utils/DateUtils";

class IssuesCommand extends Command {
	constructor() {
		super(
			"issues",
			"Shows all the issues of the given repository."
		);
	}

	async run(message: Message, args: string[]) {
		const embed = new MessageEmbed();

		const hasNoArgs = !args || typeof args[0] === "undefined";
		const notCorrectFormat = !args[0]?.includes("/");

		if (hasNoArgs || notCorrectFormat) {
			embed.setTitle("Error");
			embed.setDescription("You must provide a username and repo from GitHub.");
			embed.addField("Correct Usage", "?issues <username>/<repository>");
			embed.setColor(EMBED_COLOURS.ERROR);
		} else {
			const [user, repoName] = args[0].split("/");

			try {
				const GitHub = GitHubService.getInstance();
				const resIssues = await GitHub.getIssues(user, repoName);
				const resRep = await GitHub.getRepository(user, repoName);

				if (resIssues.length) {
					const issues = resIssues.slice(0, 3);

					embed.setTitle(`GitHub Issues: ${user}/${repoName}`);
					embed.setDescription(`${resRep.description}\n\n[View Issues on GitHub](${resRep.url}/issues) - [Create An Issue](${resRep.url}/issues/new)`);

					issues.forEach((issue: GitHubIssue) => {
						const days = DateUtils.getDaysBetweenDates(new Date(Date.now()), issue.created_at);
						const daysText = DateUtils.formatDaysAgo(days);

						embed.addField(`#${issue.number} - ${issue.title}`, `View on [GitHub](${issue.issue_url}) - ${daysText} by [${issue.author}](${issue.author_url})`);
					});

					embed.setColor(EMBED_COLOURS.SUCCESS);
				} else {
					embed.setTitle("No Issues found");
					embed.setDescription(`This repository has no issues. [Create one](${resRep.url}/issues/new)`);
					embed.setColor(EMBED_COLOURS.SUCCESS);
				}
			} catch (error) {
				embed.setTitle("Error");
				embed.setDescription("There was a problem with the request to GitHub.");
				embed.addField("Correct Usage", "?issues <username>/<repository>");
				embed.setColor(EMBED_COLOURS.ERROR);
			}
		}

		await message.channel.send({ embed });
	}
}

export default IssuesCommand;