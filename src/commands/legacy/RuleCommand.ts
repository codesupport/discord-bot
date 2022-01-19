import {ColorResolvable, Message, MessageEmbed} from "discord.js";
import Command from "../../abstracts/Command";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";

interface Rule {
	name: string;
	triggers: string[];
	description: string;
}

class RuleCommand extends Command {
	constructor() {
		super(
			"rule",
			"Get a specific rule.",
			{
				selfDestructing: true,
				aliases: ["rl"]
			}
		);
	}

	async run(message: Message, args: string[]): Promise<void> {
		const embed = new MessageEmbed();

		if (!args || typeof args[0] === "undefined") {
			embed.setTitle("Error");
			embed.setDescription("You must define a rule number.");
			embed.addField("Correct Usage", "?rule <rule number/trigger>");
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").ERROR);
		} else {
			const rule = getConfigValue<Rule[]>("rules").find(rule => rule.triggers.includes(args[0]));

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
		}

		await message.channel.send({ embeds: [embed] });
	}
}

export default RuleCommand;