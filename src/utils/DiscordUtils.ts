import { BitFieldResolvable, Guild, GuildMember, Intents, IntentsString, Snowflake } from "discord.js";

class DiscordUtils {
	static async getGuildMember(value: string, guild: Guild): Promise<GuildMember | undefined> {
		if (value === "") return;

		// UserID
		if ((/^[0-9]+$/g).test(value)) {
			try {
				return await guild.members.fetch(<Snowflake>value);
			} catch {
				return undefined;
			}
		}

		// Username and/or discriminator
		if ((/^.*#[0-9]{4}$/g).test(value)) {
			const [username, discriminator] = value.split("#");
			const memberList = await guild.members.fetch({query: username, limit: guild.memberCount});

			return memberList?.find(memberObject => memberObject.user.discriminator === discriminator);
		}

		// Everything else (Username without discriminator or nickname)
		const fetchedMembers = await guild.members.fetch({query: value});

		return fetchedMembers.first();
	}

	static getAllIntents(): BitFieldResolvable<IntentsString, number> {
		// Stole... copied from an older version of discord.js...
		// https://github.com/discordjs/discord.js/blob/51551f544b80d7d27ab0b315da01dfc560b2c115/src/util/Intents.js#L75
		return Object.values(Intents.FLAGS).reduce((acc, p) => acc | p, 0);
	}

	static getAllIntentsApartFromPresence(): BitFieldResolvable<IntentsString, number> {
		// Stole... copied from an older version of discord.js...
		// https://github.com/discordjs/discord.js/blob/51551f544b80d7d27ab0b315da01dfc560b2c115/src/util/Intents.js#L75
		return Object.values(Intents.FLAGS).reduce((acc, p) => {
			// Presence updates seem to send GuildMembers without joinedAt, we assume
			// It's being cached without this field making it null and causing issues down the line.
			// If we do not listen on this intent, it *may* not get partially cached
			// https://github.com/discordjs/discord.js/issues/3533
			if (p === Intents.FLAGS.GUILD_PRESENCES) {
				return acc;
			}

			return acc | p;
		}, 0);
	}
}

export default DiscordUtils;
