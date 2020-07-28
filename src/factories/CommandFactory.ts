import { commands_directory } from "../config.json";
import Command from "../abstracts/Command";
import DirectoryUtils from "../utils/DirectoryUtils";

class CommandFactory {
	private commands: any = {};

	async loadCommands(): Promise<void> {
		const commandFiles = await DirectoryUtils.getFilesInDirectory(
			`${__dirname}/../${commands_directory}`,
			"Command.js"
		);

		commandFiles.forEach(command => {
			const { default: Command } = command;
			const name = new Command().getName().toLowerCase();

			this.commands[name] = () => new Command();

			const aliases = new Command().getAliases();

			aliases.forEach((alias: string) => {
				this.commands[alias] = () => new Command();
			});
		});
	}

	commandExists(command: string): boolean {
		return typeof this.commands[command.toLowerCase()] !== "undefined";
	}

	getCommand(command: string): Command {
		return this.commands[command.toLowerCase()]();
	}
}

export default CommandFactory;