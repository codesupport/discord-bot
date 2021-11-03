import { Constants } from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import DiscordUtils from "../../utils/DiscordUtils";
import CommandFactory from "../../factories/CommandFactory";
import {GUILD_ID} from "../../config.json";

class CommandLoaderHandler extends EventHandler {
	private readonly commandFactory: CommandFactory;

	constructor() {
		super(Constants.Events.CLIENT_READY);
		this.commandFactory = CommandFactory.getInstance();
		this.commandFactory.loadCommands();
	}

	async handle(): Promise<void> {
		const client = DiscordUtils.getClientInstance();

		await client.application!.commands.set(this.commandFactory.getCommandsJson(), GUILD_ID);
	}
}

export default CommandLoaderHandler;
