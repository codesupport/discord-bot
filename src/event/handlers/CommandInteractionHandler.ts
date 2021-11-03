import {Constants, Interaction} from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import CommandFactory from "../../factories/CommandFactory";

class CommandInteractionHandler extends EventHandler {
	private readonly commandFactory: CommandFactory;

	constructor() {
		super(Constants.Events.INTERACTION_CREATE);
		this.commandFactory = CommandFactory.getInstance();
	}

	handle = async (interaction: Interaction): Promise<void> => {
		if (!interaction.isCommand()) return;

		await this.commandFactory.executeCommand(interaction);
	}
}

export default CommandInteractionHandler;