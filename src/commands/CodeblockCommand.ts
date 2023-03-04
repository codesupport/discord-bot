import { Discord, Slash } from "discordx";
import { EmbedBuilder, AttachmentBuilder, ColorResolvable, CommandInteraction} from "discord.js";
import getConfigValue from "../utils/getConfigValue";
import GenericObject from "../interfaces/GenericObject";

@Discord()
class CodeblockCommand {
	@Slash("codeblock")
	async onInteract(interaction: CommandInteraction): Promise<void> {
		const embed = new EmbedBuilder();
		const image = new AttachmentBuilder("./assets/codeblock.png", { name: "codeblock-tutorial.png" });

		embed.setTitle("Codeblock Tutorial");
		embed.setDescription("Please use codeblocks when sending code.");
		embed.addFields([{ name: "Sending lots of code?", value: "Consider using a [GitHub Gist](http://gist.github.com)." }]);
		embed.setImage("attachment://codeblock-tutorial.png");
		embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT);

		await interaction.reply({ embeds: [embed], files: [image] });
	}
}

export default CodeblockCommand;
