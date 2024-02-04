import { Discord, Slash } from "discordx";
import { EmbedBuilder, AttachmentBuilder, ColorResolvable, CommandInteraction} from "discord.js";
import getConfigValue from "../utils/getConfigValue";
import GenericObject from "../interfaces/GenericObject";

@Discord()
class ChallengesCommand {
  @Slash({ name: "challenges", description: "Shows a list of programming challenges" })
  async onInteract(interaction: CommandInteraction): Promise<void> {
    const embed = new EmbedBuilder();
    const image = new AttachmentBuilder("./assets/programming_challenges_v4.0.png", { name: "programming_challenges_v4.0.png" });
    
    embed.setTitle("Programming Challenges");
    embed.setDescription("Try some of these!");
    embed.setImage("attachment://programming_challenges_v4.0.png");
    embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT);
    
    await interaction.reply({ embeds: [embed], files: [image] });
  }
}

export default CodeblockCommand;
