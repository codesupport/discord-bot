import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";
import GitHubService from "../services/GitHubService";
import { EMBED_COLOURS } from "../config.json";

class GitHubCommand extends Command {
	constructor() {
		super(
			"github",
			"Shows the repo of the given user."
		);
	}

	async run(message: Message, args: string[]) {
		const embed = new MessageEmbed();

		if (!args || typeof args[0] === "undefined") {
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

				embed.setTitle(`GitHub Repository: ${res.user}/${res.repo}`);
				embed.setDescription(`${res.description}\n\n[View on GitHub](${res.url})`);
				embed.addField("Language", `${res.language}`, true);
				embed.addField("Open issues", `${res.issues_and_pullrequests_count - resPR.length}`, true);
				embed.addField("Open Pull Requests", `${resPR.length}`, true);
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