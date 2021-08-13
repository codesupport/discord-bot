import {Constants, GuildMember, RoleResolvable} from "discord.js";
import { MEMBER_ROLE } from "../../config.json";
import EventHandler from "../../abstracts/EventHandler";

class AutomaticMemberRoleHandler extends EventHandler {
	constructor() {
		super(Constants.Events.GUILD_MEMBER_ADD);
	}

	async handle(member: GuildMember): Promise<void> {
		const currentDate = Date.now();
		const memberCreatedDate = member.user.createdAt.getTime();
		const dateDifference = currentDate - memberCreatedDate;
		const hasAvatar = member.user.avatar;
		const is30DaysOld = dateDifference / 2592000000 > 1;

		if (hasAvatar && is30DaysOld) {
			await member.roles.add(<RoleResolvable>MEMBER_ROLE, "Appears to be a valid account.");
		}
	}
}

export default AutomaticMemberRoleHandler;