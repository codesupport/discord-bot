import {CommandInteraction, ApplicationCommandOptionType} from "discord.js";
import {Discord, Slash, SlashOption} from "discordx";

@Discord()
class WebsiteCommand {
	@Slash({ name: "website", description: "URL of the CodeSupport website" })
	async onInteract(
		@SlashOption({ name: "path", description: "Path to add to the URL", type: ApplicationCommandOptionType.String, required: false }) path: string | undefined,
		interaction: CommandInteraction
	): Promise<void> {
		await interaction.reply(`https://codesupport.dev/${path || ""}`);
	}
}

export default WebsiteCommand;
