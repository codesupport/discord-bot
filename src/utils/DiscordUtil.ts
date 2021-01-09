import {Guild} from "discord.js";

class DiscordUtil {
	static async getGuildMember(value: string, guild: Guild) {
		if (value === "") return;

		if ((/^[0-9]+$/g).test(value)) {
			// UserID
			return await guild.members.fetch(value) || undefined;
		} else if ((/^.*#[0-9]{4}$/g).test(value)) {
			// Username + discriminator
			const [username, discriminator] = value.split("#");
			const memberList = await guild.members.fetch({query: username});

			return memberList?.find(memberObject => memberObject.user.discriminator === discriminator);
		} else {
			// Username without discriminator
			const guildMember = await guild.members.fetch({query: value});

			return guildMember.first();
		}
	}
}

export default DiscordUtil;