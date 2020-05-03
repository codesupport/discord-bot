import { Constants, Message } from "discord.js";
import { COMMAND_PREFIX } from "../../config.json";
import EventHandler from "../../abstracts/EventHandler";
import CommandFactory from "../../factories/CommandFactory";

class CommandParserHandler extends EventHandler {
	constructor() {
		super(Constants.Events.MESSAGE_CREATE);
	}

	async handle(message: Message): Promise<void> {
		const commandFactory = new CommandFactory();

		await commandFactory.loadCommands();

		if (message.content.startsWith(COMMAND_PREFIX)) {
			const args = message.content.replace("?", "").split(" ");
			const trigger = args.shift() || args[0];

			if (commandFactory.commandExists(trigger)) {
				await commandFactory.getCommand(trigger).run(message, args);
			}
		}
	}
}

export default CommandParserHandler;