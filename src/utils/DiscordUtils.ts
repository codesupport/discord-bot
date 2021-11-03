import {BitFieldResolvable, Client, Guild, GuildMember, Intents, IntentsString, Snowflake} from "discord.js";

class DiscordUtils {
	private static client: Client | null = null;

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

	static setClientInstance(client: Client): void {
		this.client = client;
	}

	static getClientInstance(): Client {
		if (!this.client) throw new Error("Client has not been set.");
		return this.client;
	}
}

export default DiscordUtils;
