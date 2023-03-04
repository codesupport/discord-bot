import axios from "axios";
import {ColorResolvable, CommandInteraction, EmbedBuilder} from "discord.js";
import {Discord, Slash, SlashOption} from "discordx";
import getConfigValue from "../utils/getConfigValue";
import GenericObject from "../interfaces/GenericObject";

@Discord()
class NPMCommand {
	@Slash("npm")
	async onInteract(
		@SlashOption("package", {type: "STRING"}) packageName: string,
			interaction: CommandInteraction): Promise<void> {
		const embed = new EmbedBuilder();

		try {
			const url = `https://www.npmjs.com/package/${packageName}`;
			const {status} = await axios.get(url);

			if (status === 200) {
				await interaction.reply(url);
			}
		} catch (error) {
			embed.setTitle("Error");
			embed.setDescription("That is not a valid NPM package.");
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").ERROR);

			await interaction.reply({embeds: [embed], ephemeral: true});
		}
	}
}

export default NPMCommand;
