import { Discord, Slash, SlashOption } from "discordx";
import { CommandInteraction, ApplicationCommandOptionType } from "discord.js";

@Discord()
class ResourcesCommand {
	@Slash({ name: "resources", description: "Resources on the Codesupport site" })
	async onInteract(
		@SlashOption({ name: "category", description: "Resource category", type: ApplicationCommandOptionType.String, required: false }) category: string | undefined,
		interaction: CommandInteraction
	): Promise<void> {
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
