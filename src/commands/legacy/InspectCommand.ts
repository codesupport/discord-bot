import {ColorResolvable, GuildMember, Message, MessageEmbed} from "discord.js";
import DiscordUtils from "../../utils/DiscordUtils";
import Command from "../../abstracts/Command";
import DateUtils from "../../utils/DateUtils";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";

class InspectCommand extends Command {
	constructor() {
		super(
			"inspect",
			"Show information about a given user"
		);
	}

	async run(message: Message, args: string[]) {
		const userObj = args.length > 0
			? await DiscordUtils.getGuildMember(args[0], message.guild!)
			: message.member!;

		const embed = userObj === undefined
			? this.buildNoMatchEmbed()
			: this.buildInspectEmbed(userObj!);

		await message.channel.send({embeds: [embed]});
	}

	private buildNoMatchEmbed(): MessageEmbed {
		const embed = new MessageEmbed();

		embed.setTitle("Error");
		embed.setDescription("No match found.");
		embed.addField("Correct Usage", "?inspect [username|userID]");
		embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").ERROR);

		return embed;
	}

	private buildInspectEmbed(memberObj: GuildMember): MessageEmbed {
		const embed = new MessageEmbed();

		embed.setTitle(`Inspecting ${memberObj?.user.tag}`);
		embed.setColor(<ColorResolvable>(memberObj?.displayColor || getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT));
		embed.setThumbnail(memberObj?.user.displayAvatarURL());
		embed.addField("User ID", memberObj?.user.id);
		embed.addField("Username", memberObj?.user.tag);

		if (memberObj?.nickname !== null) embed.addField("Nickname", memberObj?.nickname);

		if (memberObj?.joinedAt !== null) embed.addField("Joined At", DateUtils.formatAsText(memberObj?.joinedAt!));

		if (memberObj?.roles.cache.size > 1) {
			embed.addField("Roles", `${memberObj.roles.cache.filter(role => role.id !== memberObj?.guild!.id).map(role => ` ${role.toString()}`)}`);
		} else {
			embed.addField("Roles", "No roles");
		}

		return embed;
	}
}

export default InspectCommand;
