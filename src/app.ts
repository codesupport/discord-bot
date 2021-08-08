import { Client, TextChannel, Snowflake } from "discord.js";
import { config as env } from "dotenv";
import DirectoryUtils from "./utils/DirectoryUtils";
import { handlers_directory, AUTHENTICATION_MESSAGE_CHANNEL, AUTHENTICATION_MESSAGE_ID, PRODUCTION_ENV } from "./config.json";
import DiscordUtils from "./utils/DiscordUtils";

const client = new Client({intents: DiscordUtils.getAllIntents()});

if (process.env.NODE_ENV !== PRODUCTION_ENV) {
	env({
		path: "../.env"
	});
}

async function app() {
	if (!process.env.DISCORD_TOKEN) {
		throw new Error("You must supply the DISCORD_TOKEN environment variable.");
	}

	try {
		await client.login(process.env.DISCORD_TOKEN);
		console.log(`Successfully logged in as ${client.user?.username}`);

		const handlerFiles = await DirectoryUtils.getFilesInDirectory(
			`${__dirname}/${handlers_directory}`,
			DirectoryUtils.appendFileExtension("Handler")
		);

		handlerFiles.forEach(handler => {
			const { default: Handler } = handler;
			const handlerInstance = new Handler();

			client.on(handlerInstance.getEvent(), handlerInstance.handle);
		});

		if (process.env.NODE_ENV === PRODUCTION_ENV) {
			const authChannel = await client.channels.fetch(<Snowflake>AUTHENTICATION_MESSAGE_CHANNEL) as TextChannel;

			await authChannel.messages.fetch(<Snowflake>AUTHENTICATION_MESSAGE_ID);
		}
	} catch (error) {
		console.error(error);
	}
}

export default app;
