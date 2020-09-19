import { commands_directory } from "../config.json";
import Command from "../abstracts/Command";
import DirectoryUtils from "../utils/DirectoryUtils";
import GenericObject from "../interfaces/GenericObject";

class CommandFactory {
	private commands: GenericObject<Function> = {};
	private commandAliases: GenericObject<Function> = {};

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
				this.commandAliases[alias] = () => new Command();
			});
		});
	}

	commandExists(command: string): boolean {
		return typeof this.commands[command.toLowerCase()] !== "undefined";
	}

	getCommand(command: string): Command {
		return this.commands[command.toLowerCase()]();
	}

	getCommandsWithoutAliases(): Command[] {
		return Object.keys(this.commands)
			.filter(command => !this.commands[command]().getAliases().includes(command))
			.map(command => this.commands[command]());
	}
}

export default CommandFactory;