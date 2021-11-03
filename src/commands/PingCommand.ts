import {CommandInteraction} from "discord.js";
import DiscordUtils from "../utils/DiscordUtils";
import Command from "../abstracts/Command";

class PingCommand extends Command {
	constructor() {
		super({
			name: "ping",
			description: "Shows latency"
		});
	}

	async run(interaction: CommandInteraction) {
		const client = DiscordUtils.getClientInstance();

		await interaction.reply({
			content: `Pong! Latency is ${Date.now() - interaction.createdTimestamp}ms. API Latency is ${Math.round(client.ws.ping)}ms`,
			ephemeral: true
		});
	}
}

export default PingCommand;