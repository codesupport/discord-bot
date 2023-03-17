import {ColorResolvable, CommandInteraction, EmbedBuilder, ApplicationCommandOptionType} from "discord.js";
import {Discord, Slash, SlashChoice, SlashOption} from "discordx";
import getConfigValue from "../utils/getConfigValue";
import GenericObject from "../interfaces/GenericObject";

interface Rule {
	name: string;
	triggers: string[];
	description: string;
}

const rules = getConfigValue<Rule[]>("rules").map(it => ({name: it.name, value: it.triggers[0]}));

@Discord()
class RuleCommand {
	@Slash({ name: "rule", description: "Get info about a rule" })
	async onInteract(
		@SlashChoice(...rules) @SlashOption({ name: "rule", description: "Name of a rule", type: ApplicationCommandOptionType.String, required: true }) ruleName: string,
		interaction: CommandInteraction
	): Promise<void> {
		const embed = new EmbedBuilder();

		const rule = getConfigValue<Rule[]>("rules").find(rule => rule.triggers.includes(ruleName));

		if (rule !== undefined) {
			embed.setTitle(`Rule: ${rule.name}`);
			embed.setDescription(rule.description);
			embed.addFields([{ name: "To familiarise yourself with all of the server's rules please see", value: "<#240884566519185408>" }]);
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").SUCCESS);
		}
		await interaction.reply({embeds: [embed]});
	}
}

export default RuleCommand;