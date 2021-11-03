import { commands_directory } from "../config.json";
import Command from "../abstracts/Command";
import {ApplicationCommandDataResolvable, Collection, CommandInteraction} from "discord.js";
import DirectoryUtils from "../utils/DirectoryUtils";

class CommandFactory {
	private static instance: CommandFactory;

	/* eslint-disable */
	private constructor() { }
	/* eslint-enable */

	static getInstance(): CommandFactory {
		if (!this.instance) {
			this.instance = new CommandFactory();
		}

		return this.instance;
	}

	private commands = new Collection<string, Command>();

	async loadCommands(): Promise<void> {
		const commandFiles = await DirectoryUtils.getFilesInDirectory(
			`${__dirname}/../${commands_directory}`,
			DirectoryUtils.appendFileExtension("Command")
		);

		commandFiles.forEach(command => {
			const { default: Command } = command;
			const name = new Command().getName().toLowerCase();

			this.commands.set(name, new Command());
		});
	}

	async executeCommand(interaction: CommandInteraction): Promise<void> {
		const commandInstance = await this.commands.get(interaction.commandName.toLowerCase())!;

		commandInstance.run(interaction);
	}

	getCommandsJson(): ApplicationCommandDataResolvable[] {
		return this.commands.map(command => command.getSlashCommandData());
	}
}

export default CommandFactory;
