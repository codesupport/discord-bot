import {Constants, GuildMember, MessageEmbed, TextChannel} from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import {EMBED_COLOURS, GENERAL_CHANNEL_ID, LOG_CHANNEL_ID, MOD_ROLE, RAID_SETTINGS} from "../../config.json";
import getConfigValue from "../../utils/getConfigValue";

class RaidDetectionHandler extends EventHandler {
	private joinQueue: GuildMember[] = [];
	private isAlreadyBeingExecuted = false;

	constructor() {
		super(Constants.Events.GUILD_MEMBER_ADD);
	}

	async handle(member: GuildMember): Promise<void> {
		const timeToWait = 1000 * getConfigValue<number>("RAID_SETTINGS.TIME_TILL_REMOVAL");
		const modChannel = member.guild?.channels.cache.find(channel => channel.id === LOG_CHANNEL_ID) as TextChannel;
		const generalChannel = member.guild?.channels.cache.find(channel => channel.id === GENERAL_CHANNEL_ID) as TextChannel;

		this.joinQueue.push(member);

		// This will only shift() the array if there are less members than a raid would require.
		// This also stops the code from continuing since the joinQueue is to small.
		if (this.joinQueue.length < RAID_SETTINGS.MAX_QUEUE_SIZE) {
			setTimeout(() => this.joinQueue.shift(), timeToWait);
			return;
		}

		// Will stop any new joined member from re executing the try/catch again, if its already being ran.
		if (this.isAlreadyBeingExecuted) return;
		this.isAlreadyBeingExecuted = true;

		try {
			await generalChannel.send(this.buildRaidEmbed());
			await modChannel.send(`@<${MOD_ROLE}> **RAID DETECTION**`);
			let kickCounter = 0;

			for (const member of this.joinQueue) {
				await member.kick("Detected as part of a raid.");
				await modChannel.send(`Kicked user ${member.displayName} (${member.id}).`);

				// This will send a warning message for every group in the joinQueue
				// For example, with a queue size of 30 and a raid being every 10 members, this will send 3 messages and kick all 30
				if (kickCounter >= RAID_SETTINGS.MAX_QUEUE_SIZE) {
					await generalChannel.send(this.buildRaidEmbed());
					kickCounter = 0;
				}

				kickCounter++;
			}
		} catch (error) {
			console.error(error);

			await modChannel.send(`Failed to kick users or empty queue: \n\`${error.message}\``);
		}

		this.isAlreadyBeingExecuted = false;
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
