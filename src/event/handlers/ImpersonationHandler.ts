import { Constants, GuildMember } from "discord.js";
import { MOD_ROLE } from "../../config.json";
import EventHandler from "../../abstracts/EventHandler";

class NewUserAuthenticationHandler extends EventHandler {
	constructor() {
		super(Constants.Events.GUILD_MEMBER_UPDATE);
	}

	async handle(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
		if (oldMember.roles.cache.get(MOD_ROLE)) return;

		const mods = oldMember.guild.roles.cache.get(MOD_ROLE)?.members
			.map(member => member.user.username);

		if (mods?.includes(newMember.user.username)) {
			await newMember.ban({
				reason: "Impersonation"
			});
		}
	}
}

export default NewUserAuthenticationHandler;