import "reflect-metadata";
import { Client } from "discordx";
import { TextChannel, Snowflake } from "discord.js";
import { config as env } from "dotenv";
import DirectoryUtils from "./utils/DirectoryUtils";
import { BOT_ID, GUILD_ID, handlers_directory, AUTHENTICATION_MESSAGE_CHANNEL, AUTHENTICATION_MESSAGE_ID, PRODUCTION_ENV } from "./config.json";
import DiscordUtils from "./utils/DiscordUtils";
import "./commands/slash/CodeblockCommand";

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
		const client = new Client({
			botId: BOT_ID,
			botGuilds: [GUILD_ID],
			intents: DiscordUtils.getAllIntents()
		});

		client.once("ready", async () => {
			await client.initApplicationCommands({ guild: { log: true }});
			await client.initApplicationPermissions();
		});

		client.on("interactionCreate", interaction => {
			client.executeInteraction(interaction);
		});

		await client.login(process.env.DISCORD_TOKEN!);

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