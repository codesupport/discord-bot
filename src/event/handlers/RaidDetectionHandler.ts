import {ColorResolvable, Constants, GuildMember, MessageEmbed, TextChannel} from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";

class RaidDetectionHandler extends EventHandler {
	private joinQueue: GuildMember[] = [];
	private kickFlag = false;

	constructor() {
		super(Constants.Events.GUILD_MEMBER_ADD);
	}

	handle = async (member: GuildMember): Promise<void> => {
		const timeToWait = 1000 * getConfigValue<GenericObject<number>>("RAID_SETTINGS").TIME_TILL_REMOVAL;

		this.joinQueue.push(member);
		if (this.joinQueue.length >= getConfigValue<GenericObject<number>>("RAID_SETTINGS").MAX_QUEUE_SIZE && !this.kickFlag) {
			this.kickFlag = true;
			await this.kickArray(member);
			this.kickFlag = false;
		}
		console.log(`Length: ${this.joinQueue.length} Cap ${getConfigValue<GenericObject<number>>("RAID_SETTINGS").MAX_QUEUE_SIZE}`);
		setTimeout(() => {
			if (this.joinQueue.includes(member) && !this.kickFlag) {
				this.joinQueue.splice(this.joinQueue.indexOf(member), 1);
			}
		}, timeToWait);
	}

	private async kickArray(member: GuildMember) {
		const modChannel = member.guild?.channels.cache.find(channel => channel.id === getConfigValue<string>("LOG_CHANNEL_ID")) as TextChannel;
		const generalChannel = member.guild?.channels.cache.find(channel => channel.id === getConfigValue<string>("GENERAL_CHANNEL_ID")) as TextChannel;

		try {
			while (this.joinQueue.length > 0) {
				const member = this.joinQueue.shift()!!;

				await member.kick("Detected as part of a raid.");
				await modChannel.send(`**RAID DETECTION** Kicked user ${member.displayName} (${member.id}).`);
			}

			const embed = new MessageEmbed();

			embed.setTitle(":warning: Raid Detected");
			embed.setDescription(`**We have detected a raid is currently going on and are solving the issue.**
							Please refrain from notifying the moderators or spamming this channel.
							Thank you for your cooperation and we apologise for any inconvenience.`);
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").WARNING);
			embed.setTimestamp();
			await generalChannel.send({embeds: [embed]});
		} catch (error: any) {
			console.error(error);

			if (error instanceof Error) {
				await modChannel.send(`Failed to kick users or empty queue: \n\`${error.message}\``);
			}
		}
	}
}

export default RaidDetectionHandler;
