import { commands_directory } from "../config.json";
import Command from "../abstracts/Command";
import getFilesInDirectory from "../utils/getFilesInDirectory";

class CommandFactory {
	private commands: any = {};

	async loadCommands(): Promise<void> {
		const commandFiles = await getFilesInDirectory(
			`${__dirname}/../${commands_directory}`,
			"Command.js"
		);

		commandFiles.forEach(command => {
			const { default: Command } = command;
			const name = new Command().getName().toLowerCase();

			this.commands[name] = () => new Command();
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