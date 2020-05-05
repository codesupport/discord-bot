import { Constants, Message } from "discord.js";
import { COMMAND_PREFIX } from "../../config.json";
import EventHandler from "../../abstracts/EventHandler";
import CommandFactory from "../../factories/CommandFactory";

class CommandParserHandler extends EventHandler {
	private readonly commandFactory: CommandFactory;

	constructor() {
		super(Constants.Events.MESSAGE_CREATE);

		this.commandFactory = new CommandFactory();
		this.commandFactory.loadCommands();
	}

	handle = async (message: Message): Promise<void> => {
		if (message.content.startsWith(COMMAND_PREFIX)) {
			const args = message.content.replace("?", "").split(" ");
			const trigger = args.shift() || args[0];

			/* eslint-disable */
			if (this.commandFactory.commandExists(trigger)) {
				await this.commandFactory.getCommand(trigger).run(message, args);
			}
			/* eslint-enable */
		}
	}
}

export default CommandParserHandler;