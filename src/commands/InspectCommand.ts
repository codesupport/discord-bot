import { GuildMember, Message, MessageEmbed } from "discord.js";
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
				if ((/^[0-9]+$/g).test(args[0])) {
					// - args[0] only contains numbers so its a user ID
					userObj = await message.guild?.members?.fetch(args[0]);
				} else {
					if (args[0].includes("#")) args[0] = args[0].split("#")[0];

					const userList = await message.guild?.members?.fetch({query: args[0]});

					userObj = userList?.first();
				}
			} else {
				if (message.member === null) return;
				userObj = message.member;
			}

			if (userObj !== undefined) {
				if (message.guild === undefined) return;

				embed.setTitle(`Inspecting ${userObj?.user.username}#${userObj?.user.discriminator}`);
				embed.setThumbnail(userObj?.user.displayAvatarURL());
				embed.addField("User ID", userObj?.user.id);
				embed.addField("Username", userObj?.user.username);
				embed.addField("Discriminator", userObj?.user.discriminator);
				if (userObj?.nickname !== null) embed.addField("Nickname", userObj?.nickname);
				if (userObj?.joinedAt !== null) embed.addField("Joined At", DateUtils.formatAsText(userObj?.joinedAt));
				embed.addField("Roles", `${userObj.roles.cache.filter(role => role.id !== message?.guild!.id).map(role => ` ${role.toString()}`)}`);
				embed.setColor(userObj.displayColor);
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
