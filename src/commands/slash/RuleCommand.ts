import {ColorResolvable, CommandInteraction, MessageEmbed} from "discord.js";
import {Discord, Slash, SlashChoice, SlashOption} from "discordx";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";

interface Rule {
	name: string;
	triggers: string[];
	description: string;
}

const rules = Object.assign({}, ...getConfigValue<Rule[]>("rules").map(rule => ({
	[rule.name]: rule.triggers[0]
})));

@Discord()
class RuleCommand {
	@Slash("rule")
	async onInteract(
		@SlashChoice(rules) @SlashOption("rule") ruleName: string,
			interaction: CommandInteraction): Promise<void> {
		const embed = new MessageEmbed();

		const rule = getConfigValue<Rule[]>("rules").find(rule => rule.triggers.includes(ruleName));

		if (rule !== undefined) {
			embed.setTitle(`Rule: ${rule.name}`);
			embed.setDescription(rule.description);
			embed.addField("To familiarise yourself with all of the server's rules please see", "<#240884566519185408>");
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").SUCCESS);
		}
		await interaction.reply({embeds: [embed]});
	}
}

export default RuleCommand;