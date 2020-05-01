import { Client } from "discord.js";

const client = new Client();

(async () => {
	if (process.env.DISCORD_TOKEN) {
		try {
			await client.login(process.env.DISCORD_TOKEN);

			console.log(`Successfully logged in as ${client.user?.username}`);
		} catch (error) {
			console.error(error);
		}
	} else {
		throw new Error("You must supply the DISCORD_TOKEN environment variable.");
	}
})();