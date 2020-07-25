import { Constants, GuildMember, TextChannel } from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import { MODS_CHANNEL_ID, RAID_SETTINGS, MOD_ROLE } from "../../config.json";

class RaidDetectionHandler extends EventHandler {
	constructor() {
		super(Constants.Events.GUILD_MEMBER_ADD);
	}

	private joinQueue: GuildMember[] = [];

	handle = async (member: GuildMember): Promise<void> => {
		const timeToWait = 1000 * RAID_SETTINGS.TIME_TILL_REMOVAL;
		const modChannel = member.guild?.channels.cache.find(channel => channel.id === MODS_CHANNEL_ID) as TextChannel;

		this.joinQueue.push(member);

		if (this.joinQueue.length > RAID_SETTINGS.MAX_QUEUE_SIZE) {
			await modChannel?.send(`<@&${MOD_ROLE}>, a raid has been detected!`);
		}
		setTimeout(() => {
			const index = this.joinQueue.indexOf(member);

			if (index > -1) {
				this.joinQueue.splice(index, 1);
			} else {
				modChannel?.send("Had trouble removing user from join queue");
			}
		}, timeToWait);
	}
}

export default RaidDetectionHandler;