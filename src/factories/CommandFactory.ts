import { commands_directory } from "../config.json";
import Command from "../abstracts/Command";
import {ApplicationCommandDataResolvable, Collection} from "discord.js";
import DirectoryUtils from "../utils/DirectoryUtils";

class CommandFactory {
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

	commandExists(command: string): boolean {
		return this.commands.has(command.toLowerCase());
	}

	getCommand(command: string): Command {
		return this.commands.get(command.toLowerCase())!;
	}

	getCommandsJson(): ApplicationCommandDataResolvable[] {
		return this.commands.map(command => command.getSlashCommandData());
	}
}

export default CommandFactory;
