import "reflect-metadata";
import axios from "axios";
import { Client } from "discordx";
import { TextChannel, Snowflake } from "discord.js";
import { config as env } from "dotenv";
import DirectoryUtils from "./utils/DirectoryUtils";
import DiscordUtils from "./utils/DiscordUtils";
import getConfigValue from "./utils/getConfigValue";
import Schedule from "./decorators/Schedule";

if (process.env.NODE_ENV !== getConfigValue<string>("PRODUCTION_ENV")) {
	env({
		path: "../.env"
	});
}

class App {
	private readonly client: Client;

	constructor() {
		if (!process.env.DISCORD_TOKEN) {
			throw new Error("You must supply the DISCORD_TOKEN environment variable.");
		}

		this.client = new Client({
			botId: getConfigValue<string>("BOT_ID"),
			botGuilds: [getConfigValue<string>("GUILD_ID")],
			intents: DiscordUtils.getAllIntentsApartFromPresence()
		});
	}

	@Schedule("*/5 * * * *")
	async reportHealth(): Promise<void> {
		await axios.get(process.env.HEALTH_CHECK_URL!);
	}

	async init(): Promise<void> {
		this.client.once("ready", async () => {
			await this.client.initApplicationCommands({ guild: { log: true }});
			await this.client.initApplicationPermissions();
		});

		await DirectoryUtils.getFilesInDirectory(
			`${__dirname}/${getConfigValue<string>("commands_directory")}`,
			DirectoryUtils.appendFileExtension("Command")
		);

		this.client.on("interactionCreate", interaction => {
			this.client.executeInteraction(interaction);
		});

		await this.client.login(process.env.DISCORD_TOKEN!);

		const handlerFiles = await DirectoryUtils.getFilesInDirectory(
			`${__dirname}/${getConfigValue<string>("handlers_directory")}`,
			DirectoryUtils.appendFileExtension("Handler")
		);

		handlerFiles.forEach(handler => {
			const { default: Handler } = handler;
			const handlerInstance = new Handler();

			this.client.on(handlerInstance.getEvent(), handlerInstance.handle);
		});

		if (process.env.NODE_ENV === getConfigValue<string>("PRODUCTION_ENV")) {
			const channelSnowflake = getConfigValue<Snowflake>("AUTHENTICATION_MESSAGE_CHANNEL");
			const messageSnowflake = getConfigValue<Snowflake>("AUTHENTICATION_MESSAGE_ID");

			if (channelSnowflake && messageSnowflake) {
				const authChannel = await this.client.channels.fetch(channelSnowflake) as TextChannel;

				await authChannel.messages.fetch(messageSnowflake);
			}
		}
	}
}

export default App;