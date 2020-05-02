import { Client } from "discord.js";
import CommandFactory from "./factories/CommandFactory";

const client = new Client();

(async () => {
	if (process.env.DISCORD_TOKEN) {
		try {
			await client.login(process.env.DISCORD_TOKEN);

			console.log(`Successfully logged in as ${client.user?.username}`);

			const commandFactory = new CommandFactory();

			await commandFactory.loadCommands();

			client.on("message", (message) => {
				if (message.content.startsWith("?")) {
					const args = message.content.replace("?", "").split(" ");
					const trigger = args.shift() || args[0];

					if (commandFactory.commandExists(trigger)) {
						commandFactory.getCommand(trigger).run(message, args);
					}
				}
			});

		} catch (error) {
			console.error(error);
		}
	} else {
		throw new Error("You must supply the DISCORD_TOKEN environment variable.");
	}
})();