import {Client} from "discord.js";
import DiscordUtils from "./DiscordUtils";

const client = new Client({intents: DiscordUtils.getAllIntents()});

export default client;