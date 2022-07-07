import {ColorResolvable, CommandInteraction, MessageEmbed} from "discord.js";
import GitHubService from "../services/GitHubService";
import getConfigValue from "../utils/getConfigValue";
import GenericObject from "../interfaces/GenericObject";
import {Discord, Slash, SlashOption} from "discordx";

@Discord()
class GitHubCommand {
	@Slash("github")
	async onInteract(
		@SlashOption("user", {type: "STRING"}) user: string,
		@SlashOption("repository", {type: "STRING"}) repo: string,
			interaction: CommandInteraction): Promise<void> {
		const embed = new MessageEmbed();

		try {
			const GitHub = GitHubService.getInstance();
			const res = await GitHub.getRepository(user, repo);
			const resPR = await GitHub.getPullRequest(user, repo);

			let desc = `[View on GitHub](${res.url})`;

			if (res.description) desc = `${res.description}\n\n${desc}`;

			embed.setTitle(`GitHub Repository: ${res.user}/${res.repo}`);
			embed.setDescription(desc);
			embed.addField("Language", res.language, true);
			embed.addField("Open issues", (res.issues_and_pullrequests_count - resPR.length).toString(), true);
			embed.addField("Open Pull Requests", resPR.length.toString(), true);
			embed.addField("Forks", res.forks.toString(), true);
			embed.addField("Stars", res.stars.toString(), true);
			embed.addField("Watchers", res.watchers.toString(), true);
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").SUCCESS);
			await interaction.reply({embeds: [embed]});
		} catch (error) {
			embed.setTitle("Error");
			embed.setDescription("There was a problem with the request to GitHub.");
			embed.addField("Correct Usage", "?github <username>/<repository>");
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").ERROR);
			await interaction.reply({embeds: [embed], ephemeral: true});
		}
	}
}

export default GitHubCommand;