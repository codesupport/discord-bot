import { GuildMember, Message, MessageEmbed } from "discord.js";
import getMemberUtil from "../utils/getMemberUtil";
import Command from "../abstracts/Command";
import DateUtils from "../utils/DateUtils";
import { EMBED_COLOURS } from "../config.json";

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
			let userObj: GuildMember | undefined;

			if (args.length > 0) {
				userObj = await getMemberUtil.getGuildMember(args[0], message.guild!);
			} else {
				if (message.member === null) return;
				userObj = message.member;
			}

			if (userObj !== undefined) {
				if (message.guild === undefined) return;

				embed.setTitle(`Inspecting ${userObj?.user.tag}`);
				embed.setThumbnail(userObj?.user.displayAvatarURL());
				embed.addField("User ID", userObj?.user.id);
				embed.addField("Username", userObj?.user.tag);
				if (userObj?.nickname !== null) embed.addField("Nickname", userObj?.nickname);
				if (userObj?.joinedAt !== null) embed.addField("Joined At", DateUtils.formatAsText(userObj?.joinedAt));

				if (userObj?.roles.cache.size > 1) {
					embed.addField("Roles", `${userObj.roles.cache.filter(role => role.id !== message?.guild!.id).map(role => ` ${role.toString()}`)}`);
				} else {
					embed.addField("Roles", "No roles");
				}

				embed.setColor(userObj?.displayColor || EMBED_COLOURS.DEFAULT);
			} else {
				embed.setTitle("Error");
				embed.setDescription("No match found.");
				embed.addField("Correct Usage", "?inspect [username|userID]");
				embed.setColor(EMBED_COLOURS.ERROR);
			}
		} catch (error) {
			embed.setTitle("Error");
			embed.setDescription("Incorrect usage of command");
			embed.addField("Correct Usage", "?inspect [username|userID]");
			embed.setColor(EMBED_COLOURS.ERROR);
		}

		await message.channel.send({embed});
	}
}

export default InspectCommand;
