import { Constants, GuildMember, TextChannel } from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import { RAID_SETTINGS, LOG_CHANNEL_ID } from "../../config.json";
import getConfigValue from "../../utils/getConfigValue";

class RaidDetectionHandler extends EventHandler {
	private joinQueue: GuildMember[] = [];

	constructor() {
		super(Constants.Events.GUILD_MEMBER_ADD);
	}

	handle = async (member: GuildMember): Promise<void> => {
		const timeToWait = 1000 * getConfigValue<number>("RAID_SETTINGS.TIME_TILL_REMOVAL");
		const modChannel = member.guild?.channels.cache.find(channel => channel.id === LOG_CHANNEL_ID) as TextChannel;

		this.joinQueue.push(member);

		if (this.joinQueue.length >= RAID_SETTINGS.MAX_QUEUE_SIZE) {
			await Promise.all(this.joinQueue.map(async member => {
				await member.kick("Detected as part of a raid.");
				await modChannel.send(`**RAID DETECTION** Kicked user ${member.displayName} (${member.id}).`);
			}));

			this.joinQueue = [];
		}

		setTimeout(() => {
			if (this.joinQueue.includes(member)) {
				this.joinQueue.splice(this.joinQueue.indexOf(member), 1);
			}
		}, timeToWait);
	}
}

export default RaidDetectionHandler;