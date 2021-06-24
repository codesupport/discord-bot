import {Constants, GuildMember, MessageEmbed, TextChannel} from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import {EMBED_COLOURS, GENERAL_CHANNEL_ID, LOG_CHANNEL_ID, MOD_ROLE, RAID_SETTINGS} from "../../config.json";
import getConfigValue from "../../utils/getConfigValue";

class RaidDetectionHandler extends EventHandler {
	private joinQueue: GuildMember[] = [];
	private isActive = false;

	constructor() {
		super(Constants.Events.GUILD_MEMBER_ADD);
	}

	async handle(member: GuildMember): Promise<void> {
		const timeToWait = 1000 * getConfigValue<number>("RAID_SETTINGS.TIME_TILL_REMOVAL");
		const modChannel = member.guild?.channels.cache.find(channel => channel.id === LOG_CHANNEL_ID) as TextChannel;
		const generalChannel = member.guild?.channels.cache.find(channel => channel.id === GENERAL_CHANNEL_ID) as TextChannel;

		this.joinQueue.push(member);

		if (this.joinQueue.length < RAID_SETTINGS.MAX_QUEUE_SIZE) {
			setTimeout(() => this.joinQueue.shift(), timeToWait);
			return;
		}

		if (this.isActive) return;
		this.isActive = true;

		try {
			await generalChannel.send(this.buildRaidEmbed());
			await modChannel.send(`@<${MOD_ROLE}> **RAID DETECTION**`);
			const zeroIndexQueueSize = RAID_SETTINGS.MAX_QUEUE_SIZE - 1;

			// If 14 join, only 10 get kicked, others are stuck in Limbo, since timeout was ignored (que is bigger then max size)
			// And the below statement only kicks 10 members
			for (const member of this.joinQueue.splice(0, zeroIndexQueueSize)) {
				await member.kick("Detected as part of a raid.");
				await modChannel.send(`Kicked user ${member.displayName} (${member.id}).`);
			}
		} catch (error) {
			console.error(error);

			await modChannel.send(`Failed to kick users or empty queue: \n\`${error.message}\``);
		}

		this.isActive = false;
	}

	private buildRaidEmbed(): MessageEmbed {
		const embed = new MessageEmbed();

		embed.setTitle(":warning: Raid Detected");
		embed.setDescription(`**We have detected a raid is currently going on and are solving the issue.**
					Please refrain from notifying the moderators or spamming this channel.
					Thank you for your cooperation and we apologise for any inconvenience.`);
		embed.setColor(EMBED_COLOURS.WARNING);
		embed.setTimestamp();

		return embed;
	}
}

export default RaidDetectionHandler;
