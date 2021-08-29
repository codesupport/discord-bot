import {
    ColorResolvable,
    Guild,
    GuildMember,
    Message,
    MessageEmbed,
    MessageOptions,
    TextChannel
} from "discord.js";
import {SERVER_ID, DISCORD, LOG_CHANNEL_ID, MEMBER_ROLE_COLOR, MOD_ROLE} from "../config.json";
import DateUtils from "../utils/DateUtils";
import axios from "axios";
import getEnvironmentVariable from "../utils/getEnvironmentVariable";
import client from "../utils/DiscordClient";

let GUILD: Guild;
let LOG_CHANNEL: TextChannel;

const RAW_REQUEST_HEADERS = {
    "Authorization": `Bot ${getEnvironmentVariable("DISCORD_TOKEN")}`,
    "Content-TYpe": "application/son"
};

/**
 * Helper method to initialize the {@link GUILD} and {@link LOG_CHANNEL} references to be used
 * by the {@link AdminService} instance.
 */
async function initializeGuildData(): Promise<void> {
    try {
		const response = await axios.get(`${DISCORD.API}/guilds/${SERVER_ID}`, {headers: RAW_REQUEST_HEADERS});

		GUILD = new Guild(client, response.data);
		LOG_CHANNEL = await GUILD.channels.fetch(LOG_CHANNEL_ID) as TextChannel
	} catch (error) {
    	console.log(`Failed to retrieve guild info: ${error.message}`);
	}
}

/**
 * Service for handling common {@link Guild} interactions.
 */
export class AdminService {

    /**
     * Initializes this {@link AdminService} instance's properties.
     */
    async init() {
        if (GUILD === undefined) {
            await initializeGuildData();
        }
    }

    /**
     * Kicks a member from the server.
     *
     * @param member        The {@link GuildMember} to remove from the server.
     * @param reason        The reason the {@link GuildMember} was kicked.
     * @param notice        A notice to be displayed with the log message.
     * @param userMessage   An option {@link Message} to associate with the {@link GuildMember} being kicked.
     */
    async kickUser(member: GuildMember, reason: string, notice: string, userMessage: Message): Promise<void> {
        await member.kick(reason);

        await this.logMessage(
        	LogLevel.ALERT,
			`@<${MOD_ROLE}> **${notice}** Kicked user ${member.displayName} (${member.id}).`,
			userMessage
		);
    }

    /**
     * Deletes the specified channel message.
     *
     * @param channelId The channel id the {@link Message} to be deleted is in.
     * @param messageId The message id of the {@link Message} to delete.
     */
    async deleteMessage(channelId: string, messageId: string): Promise<void> {
        await axios.delete(`${DISCORD.API}/channels/${channelId}/messages/${messageId}`, {headers: RAW_REQUEST_HEADERS});
    }

    /**
     * Creates a log entry in the log channel denoted by the {@link LOG_CHANNEL_ID}.
     *
     * @param level         The type of log notification to make (the colour/representation).
     * @param message       The message to be displayed in the log notification.
     * @param userMessage   An optional user {@link Message} to associate with the log entry.
     */
    async logMessage(level: LogLevel, message: string, userMessage: Message) {
        let embed = undefined;

        const messageOptions: MessageOptions = {
            content: message,
        };

        if (userMessage != undefined) {
            embed = new MessageEmbed();

            embed.setAuthor(this.getAuthorName(userMessage), this.getAvatarUrl(userMessage), userMessage.url);
            embed.setDescription(`<#${userMessage.id}>\n\n${userMessage.content}\n`);
            embed.setFooter(`Message sent at ${DateUtils.formatAsText(userMessage.createdAt)}`);
            embed.setColor(<ColorResolvable>(userMessage.member?.displayColor || MEMBER_ROLE_COLOR));

            messageOptions.embeds = [embed];
        }

		await LOG_CHANNEL.send(messageOptions);
    }

    /**
     * Helper method to retrieve the author of a given {@link Message}.
     *
     * @param message The {@link Message} to get the author of.
     *
     * @returns string The author of the provided {@link Message}.
     */
	getAuthorName(message: Message): string {
		return message.member?.nickname || message.author.username;
	}

    /**
     * Helper method to retrieve the avatar url for the author of a given {@link Message}.
     *
     * @param message The {@link Message} to acquire an author's avatar url from.
     *
     * @returns string The avatar url of the author of the provided {@link Message}.
     */
	getAvatarUrl(message: Message): string | undefined {
		return message.author.avatarURL() || undefined;
	}
}

/**
 * Helper enum to specify log levels.
 */
export enum LogLevel {
	NOTICE,
	ALERT,
}