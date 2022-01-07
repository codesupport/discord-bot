import {ColorResolvable, Constants, GuildMember, MessageEmbed, TextChannel} from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";

class RaidDetectionHandler extends EventHandler {
	private joinQueue: GuildMember[] = [];

	constructor() {
		super(Constants.Events.GUILD_MEMBER_ADD);
	}

	handle = async (member: GuildMember): Promise<void> => {
		const timeToWait = 1000 * getConfigValue<GenericObject<number>>("RAID_SETTINGS").TIME_TILL_REMOVAL;
		const modChannel = member.guild?.channels.cache.find(channel => channel.id === getConfigValue<string>("LOG_CHANNEL_ID")) as TextChannel;
		const generalChannel = member.guild?.channels.cache.find(channel => channel.id === getConfigValue<string>("GENERAL_CHANNEL_ID")) as TextChannel;

		this.joinQueue.push(member);

		if (this.joinQueue.length >= getConfigValue<GenericObject<number>>("RAID_SETTINGS").MAX_QUEUE_SIZE) {
			try {
				await Promise.all(this.joinQueue.map(async member => {
					await member.kick("Detected as part of a raid.");
					await modChannel.send(`@<${getConfigValue<string>("MOD_ROLE")}> **RAID DETECTION** Kicked user ${member.displayName} (${member.id}).`);
				}));

				this.joinQueue = [];

				const embed = new MessageEmbed();

				embed.setTitle(":warning: Raid Detected");
				embed.setDescription(`**We have detected a raid is currently going on and are solving the issue.**
					Please refrain from notifying the moderators or spamming this channel.
					Thank you for your cooperation and we apologise for any inconvenience.`);
				embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").WARNING);
				embed.setTimestamp();

				await generalChannel.send({embeds: [embed]});
			} catch (error) {
				console.error(error);

				await modChannel.send(`Failed to kick users or empty queue: \n\`${error.message}\``);
			}
		}

		setTimeout(() => {
			if (this.joinQueue.includes(member)) {
				this.joinQueue.splice(this.joinQueue.indexOf(member), 1);
			}
		}, timeToWait);
	}
}

export default RaidDetectionHandler;
