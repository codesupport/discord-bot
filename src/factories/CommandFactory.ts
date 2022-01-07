import Command from "../abstracts/Command";
import DirectoryUtils from "../utils/DirectoryUtils";
import getConfigValue from "../utils/getConfigValue";

class CommandFactory {
	private commands: any = {};

	async loadCommands(): Promise<void> {
		const commandFiles = await DirectoryUtils.getFilesInDirectory(
			`${__dirname}/../${getConfigValue<string>("commands_directory")}`,
			DirectoryUtils.appendFileExtension("Command")
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
