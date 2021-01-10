import { Guild, GuildMember } from "discord.js";

class DiscordUtils {
	static async getGuildMember(value: string, guild: Guild): Promise<GuildMember | undefined> {
		if (value === "") return;

		// UserID
		if ((/^[0-9]+$/g).test(value)) {
			try {
				return await guild.members.fetch(value);
			} catch {
				return undefined;
			}
		}

		// Username and/or discriminator
		if ((/^.*#[0-9]{4}$/g).test(value)) {
			const [username] = value.split("#");
			const memberList = await guild.members.fetch({query: username, limit: 1000000000});

			return memberList?.find(memberObject => memberObject.user.tag === value);
		}

		// Everything else (Username without discriminator or nickname)
		const fetchedMembers = await guild.members.fetch({query: value, limit: 1000000000});

		return fetchedMembers.first();
	}
}

export default DiscordUtils;