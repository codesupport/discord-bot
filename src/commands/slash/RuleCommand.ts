import {AutocompleteInteraction, ColorResolvable, CommandInteraction, MessageEmbed} from "discord.js";
import {Discord, Slash, SlashOption} from "discordx";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";

interface Rule {
	name: string;
	triggers: string[];
	description: string;
}

const rules = getConfigValue<Rule[]>("rules").map(it => ({name: it.name, value: it.triggers[0]}));

@Discord()
class RuleCommand {
	@Slash("rule")
	async onInteract(
		@SlashOption("rule", {
			autocomplete: (interaction: AutocompleteInteraction) => {
				interaction.respond(rules);
			},
			type: "STRING"
		}) ruleName: string, interaction: CommandInteraction): Promise<void> {
		const embed = new MessageEmbed();

		const rule = getConfigValue<Rule[]>("rules").find(rule => rule.triggers.includes(ruleName));

		if (rule !== undefined) {
			embed.setTitle(`Rule: ${rule.name}`);
			embed.setDescription(rule.description);
			embed.addField("To familiarise yourself with all of the server's rules please see", "<#240884566519185408>");
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").SUCCESS);
		} else {
			embed.setTitle("Error");
			embed.setDescription("Unknown rule number/trigger.");
			embed.addField("Correct Usage", "?rule <rule number/trigger>");
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").ERROR);
		}
		await interaction.reply({embeds: [embed], ephemeral: rule === undefined});
	}
}

export default RuleCommand;