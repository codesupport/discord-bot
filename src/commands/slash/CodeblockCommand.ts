import { Discord, Slash } from "discordx";
import { MessageEmbed, MessageAttachment, ColorResolvable, CommandInteraction} from "discord.js";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";

@Discord()
class CodeblockCommand {
	@Slash("codeblock")
	async onInteract(interaction: CommandInteraction): Promise<void> {
		const embed = new MessageEmbed();
		const image = new MessageAttachment("./assets/codeblock.png", "codeblock-tutorial.png");

		embed.setTitle("Codeblock Tutorial");
		embed.setDescription("Please use codeblocks when sending code.");
		embed.addField("Sending lots of code?", "Consider using a [GitHub Gist](http://gist.github.com).");
		embed.setImage("attachment://codeblock-tutorial.png");
		embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT);

		await interaction.reply({ embeds: [embed], files: [image] });
	}
}

export default CodeblockCommand;
