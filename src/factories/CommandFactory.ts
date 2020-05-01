import { commands_directory } from "../config.json";
import { readDirectory } from "../utils/readDirectory";
import RunnableCommand from "../interfaces/RunnableCommand";

class CommandFactory {
	private commands: any = {};

	async loadCommands() {
		const commandsDirectory = await readDirectory(`${__dirname}/../${commands_directory}`);
		const commandFiles = commandsDirectory
			.filter(file => file.endsWith("Command.js"))
			.map(file => require(`${__dirname}/../${commands_directory}/${file}`));

		commandFiles.forEach((command) => {
			const { C } = command;
			const name = new C().getName();

			this.commands[name] = () => new C();
		});
	}

	commandExists(command: string) {
		return this.commands[command] !== "undefined";
	}

	getCommand(command: string): RunnableCommand {
		return this.commands[command]();
	}
}

export default CommandFactory;