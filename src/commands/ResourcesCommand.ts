import { Discord, Slash, SlashOption } from "discordx";
import { CommandInteraction } from "discord.js";

@Discord()
class ResourcesCommand {
	@Slash("resources")
	async onInteract(
		@SlashOption("category", { required: false }) category: string, interaction: CommandInteraction
	) {
		let url = "https://codesupport.dev/resources";

		if (category) {
			url += `?category=${category}`;
		}

		await interaction.reply({
			content: url
		});
	}
}

export default ResourcesCommand;
