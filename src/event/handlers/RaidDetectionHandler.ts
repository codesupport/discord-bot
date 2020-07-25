import { Constants, GuildMember, TextChannel } from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import { MOD_CHANNEL_ID, RAID_SETTINGS, MOD_ROLE } from "../../config.json";
import getConfigValue from "../../utils/getConfigValue";

class RaidDetectionHandler extends EventHandler {
	private joinQueue: GuildMember[] = [];

	constructor() {
		super(Constants.Events.GUILD_MEMBER_ADD);
	}

	handle = async (member: GuildMember): Promise<void> => {
		const timeToWait = 1000 * getConfigValue("RAID_SETTINGS.TIME_TILL_REMOVAL");
		const modChannel = member.guild?.channels.cache.find(channel => channel.id === MOD_CHANNEL_ID) as TextChannel;

		this.joinQueue.push(member);

		if (this.joinQueue.length > RAID_SETTINGS.MAX_QUEUE_SIZE) {
			await modChannel?.send(`<@&${MOD_ROLE}>, a raid has been detected!`);
		}

		setTimeout(() => {
			const index = this.joinQueue.indexOf(member);

			if (index > -1) {
				this.joinQueue.splice(index, 1);
			} else {
				modChannel?.send(`Had trouble removing user: <@${member.id}> from join queue`);
			}
		}, timeToWait);
	}
}

export default RaidDetectionHandler;