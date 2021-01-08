import {Guild} from "discord.js";

class getMemberUtil {
	static async getGuildMember(value: string, guild: Guild) {
		if (value === "") return;

		if ((/^[0-9]+$/g).test(value)) {
			// UserID
			return guild.members?.fetch(value);
		} else if ((/^.*#[0-9]{4}$/g).test(value)) {
			// Username + discriminator
			const [username, discriminator] = value.split("#");
			const userList = await guild.members?.fetch({query: username});

			return await userList?.find(memberObject => memberObject.user.discriminator === discriminator);
		} else {
			// Username without discriminator
			const userObj = await guild.members?.fetch({query: value});

			return userObj.first();
		}
	}
}

export default getMemberUtil;