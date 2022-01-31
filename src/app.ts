import "reflect-metadata";
import { Client } from "discordx";
import { TextChannel, Snowflake } from "discord.js";
import { config as env } from "dotenv";
import DirectoryUtils from "./utils/DirectoryUtils";
import DiscordUtils from "./utils/DiscordUtils";
import getConfigValue from "./utils/getConfigValue";
import "./commands/slash/CodeblockCommand";
import "./commands/slash/HiringLookingCommand";

if (process.env.NODE_ENV !== getConfigValue<string>("PRODUCTION_ENV")) {
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
			botId: getConfigValue<string>("BOT_ID"),
			botGuilds: [getConfigValue<string>("GUILD_ID")],
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
			`${__dirname}/${getConfigValue<string>("handlers_directory")}`,
			DirectoryUtils.appendFileExtension("Handler")
		);

		handlerFiles.forEach(handler => {
			const { default: Handler } = handler;
			const handlerInstance = new Handler();

			client.on(handlerInstance.getEvent(), handlerInstance.handle);
		});

		if (process.env.NODE_ENV === getConfigValue<string>("PRODUCTION_ENV")) {
			const channelSnowflake = getConfigValue<Snowflake>("AUTHENTICATION_MESSAGE_CHANNEL");
			const messageSnowflake = getConfigValue<Snowflake>("AUTHENTICATION_MESSAGE_ID");

			if (channelSnowflake && messageSnowflake) {
				const authChannel = await client.channels.fetch(channelSnowflake) as TextChannel;

				await authChannel.messages.fetch(messageSnowflake);
			}
		}
	} catch (error) {
		console.error(error);
	}
}

export default app;
