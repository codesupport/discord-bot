import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";
import { EMBED_COLOURS, COMMAND_PREFIX } from "../config.json";

class CommandListCommand extends Command {
	private commands: Command[] = [];

	constructor() {
		super(
			"commands",
			"Lists all the bot commands.",
			{
				aliases: ["help", "command"]
			}
		);
	}

	setCommands(commands: Command[]) {
		this.commands = commands;
	}

	async run(message: Message, args: string[]) {
		const embed = new MessageEmbed();

		if (args.length) {
			const command = this.commands.find(command => command.getName() === args[0]);

			if (!command) {
				embed.setTitle("Error");
				embed.setColor(EMBED_COLOURS.ERROR);
				embed.setDescription("That command does not exist.");
			} else {
				const aliases = command.getAliases().map(alias => `\`${COMMAND_PREFIX}${alias}\``);

				embed.setTitle(`Commands • ${COMMAND_PREFIX}${command.getName()}`);
				embed.setColor(EMBED_COLOURS.DEFAULT);
				embed.setDescription(command.getDescription());

				if (aliases.length) embed.addField("Aliases", aliases.join(", "));
			}
		} else {
			embed.setTitle("Commands");
			embed.setColor(EMBED_COLOURS.DEFAULT);

			this.commands.forEach(command => {
				embed.addField(
					`${COMMAND_PREFIX}${command.getName()}`,
					command.getDescription(),
					true
				);
			});
		}

		await message.channel.send({ embed });
	}
}

export default CommandListCommand;