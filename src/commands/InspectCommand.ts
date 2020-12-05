import {Message, MessageEmbed} from "discord.js";
import Command from "../abstracts/Command";
import DateUtils from "../utils/DateUtils";
import {EMBED_COLOURS} from "../config.json";

class InspectCommand extends Command {
	constructor() {
		super(
			"inspect",
			"Show information about a given user"
		);
	}

	async run(message: Message, args: string[]) {
		const embed = new MessageEmbed();

		const hasNoArgs = !args || typeof args[0] === "undefined";
		const notCorrectFormat = !args[0]?.includes("#");

		if (hasNoArgs || notCorrectFormat) {
			embed.setTitle("Error");
			embed.setDescription("You must provide a username and discriminator");
			embed.addField("Correct Usage", "?inspect <username>");
			embed.setColor(EMBED_COLOURS.ERROR);
		} else {
			try {
				const userData = args[0].split("#");
				const username = userData[0];
				const discriminator = userData[1];
				let userObj;

				const userList = await message.guild?.members?.fetch({query: username, limit: 1000});

				if (userList === undefined) return;

				if (userList?.size > 1) {
					userObj = await userList?.find(memberObject => memberObject.user.discriminator === discriminator);
				} else if (userList.size === 1) {
					userObj = userList?.first();
				}

				if (userObj === undefined) return;

				embed.setTitle(`Inspecting ${userObj?.user.tag}`);
				embed.setThumbnail(userObj?.user.displayAvatarURL());
				embed.addField("User ID", userObj?.user.id);
				embed.addField("Username", userObj?.user.tag);
				embed.addField("Join At", DateUtils.formatAsText(userObj?.joinedAt));
				if (userObj?.nickname !== null) embed.addField("Nickname", userObj?.nickname);
				embed.addField("Roles", `${userObj.roles.cache.map(role => role.toString())}`);
				embed.setColor(EMBED_COLOURS.SUCCESS);
			} catch (error) {
				embed.setTitle("Error");
				embed.setDescription("There was a problem inspecting this user");
				embed.addField("Correct Usage", "?inspect <username>");
				embed.setColor(EMBED_COLOURS.ERROR);
			}
		}

		await message.channel.send({embed});
	}
}

export default InspectCommand;