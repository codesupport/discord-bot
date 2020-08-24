import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";
import GitHubService from "../services/GitHubService";
import { EMBED_COLOURS } from "../config.json";

class GitHubCommand extends Command {
	constructor() {
		super(
			"github",
			"Shows the repo of the given user.",
			{
				aliases: ["gh"]
			}
		);
	}

	async run(message: Message, args: string[]) {
		const embed = new MessageEmbed();

		const hasNoArgs = !args || typeof args[0] === "undefined";
		const notCorrectFormat = !args[0]?.includes("/");

		if (hasNoArgs || notCorrectFormat) {
			embed.setTitle("Error");
			embed.setDescription("You must provide a username and repo from GitHub.");
			embed.addField("Correct Usage", "?github <username>/<repository>");
			embed.setColor(EMBED_COLOURS.ERROR);
		} else {
			const [user, repoName] = args[0].split("/");

			try {
				const GitHub = GitHubService.getInstance();
				const res = await GitHub.getRepository(user, repoName);
				const resPR = await GitHub.getPullRequest(user, repoName);

				let desc = `[View on GitHub](${res.url})`;

				if (res.description) desc = `${res.description}\n\n${desc}`;

				embed.setTitle(`GitHub Repository: ${res.user}/${res.repo}`);
				embed.setDescription(desc);
				embed.addField("Language", res.language, true);
				embed.addField("Open issues", res.issues_and_pullrequests_count - resPR.length, true);
				embed.addField("Open Pull Requests", resPR.length, true);
				embed.addField("Forks", res.forks, true);
				embed.addField("Stars", res.stars, true);
				embed.addField("Watchers", res.watchers, true);
				embed.setColor(EMBED_COLOURS.SUCCESS);
			} catch (error) {
				embed.setTitle("Error");
				embed.setDescription("There was a problem with the request to GitHub.");
				embed.addField("Correct Usage", "?github <username>/<repository>");
				embed.setColor(EMBED_COLOURS.ERROR);
			}
		}

		await message.channel.send({ embed });
	}
}

export default GitHubCommand;