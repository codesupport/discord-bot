import { Message, MessageEmbed } from "discord.js";
import { rules } from "../config.json";
import Command from "../abstracts/Command";

class RuleCommand extends Command {
	constructor() {
		super(
			"rule",
			"Get a specific rule.",
			{
				selfDestructing: true
			}
		);
	}

	async run(message: Message, args: string[]): Promise<void> {
		const embed = new MessageEmbed();

		if (!args || typeof args[0] === "undefined") {
			embed.setTitle("Error");
			embed.setDescription("You must define a rule number.");
			embed.addField("Correct Usage", "?rule <rule number/trigger>");
		} else {
			const rule = rules.find(rule => rule.triggers.includes(args[0]));

			if (rule !== undefined) {
				embed.setTitle(`Rule: ${rule.name}`);
				embed.setDescription(rule.description);
				embed.addField("To familiarise yourself with all of the server's rules please see", "<#240884566519185408>");
			} else {
				embed.setTitle("Error");
				embed.setDescription("Unknown rule number/trigger.");
				embed.addField("Correct Usage", "?rule <rule number/trigger>");
			}
		}

		await message.channel.send({ embed });
	}
}

export default RuleCommand;