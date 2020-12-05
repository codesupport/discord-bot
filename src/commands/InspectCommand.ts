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

		try {
			let userObj;

			if (args.length > 0 && isNaN(Number(args[0]))) {
				const userData = args[0].split("#");
				const username = userData[0];
				const discriminator = userData[1];

				const userList = await message.guild?.members?.fetch({query: username, limit: 1000});

				if (userList === undefined) return;

				if (userList?.size > 1) {
					userObj = await userList?.find(memberObject => memberObject.user.discriminator === discriminator);
				} else if (userList.size === 1) {
					userObj = userList?.first();
				}
			} else if (args.length > 0) {
				if (message.guild === null) return;
				userObj = message.guild.members.cache.get(args[0]);
			} else if (!args.length) {
				if (message.member === null) return;
				userObj = message.member;
			}

			if (userObj === undefined) throw "";
			if (message.guild === undefined) return;
			if (userObj?.joinedAt === null) return;

			embed.setTitle(`Inspecting ${userObj?.user.tag}`);
			embed.setThumbnail(userObj?.user.displayAvatarURL());
			embed.addField("User ID", userObj?.user.id);
			embed.addField("Username", userObj?.user.tag);
			embed.addField("Joined At", DateUtils.formatAsText(userObj?.joinedAt));
			if (userObj?.nickname !== null) embed.addField("Nickname", userObj?.nickname);
			embed.addField("Roles", `${userObj.roles.cache.filter(role => role.id !== message?.guild!.id).map(role => ` ${role.toString()}`)}`);
			embed.setColor(EMBED_COLOURS.SUCCESS);
		} catch (error) {
			embed.setTitle("Error");
			embed.setDescription("Unable to inspect user");
			embed.addField("Correct Usage", "?inspect [username + discriminator / userID]");
			embed.setColor(EMBED_COLOURS.ERROR);
		}

		await message.channel.send({embed});
	}
}

export default InspectCommand;