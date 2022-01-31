import {Discord, Slash, SlashOption} from "discordx";
import {MessageEmbed, ColorResolvable, CommandInteraction, GuildMember} from "discord.js";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";
import DateUtils from "../../utils/DateUtils";
import DiscordUtils from "../../utils/DiscordUtils";

@Discord()
class InspectCommand {
	@Slash("inspect")
	async onInteract(@SlashOption("id", {description: "ID of user", required: false}) userID: string, interaction: CommandInteraction): Promise<void> {
		let memberID: string;

		if (userID === undefined) {
			memberID = interaction.member!.user.id;
		} else {
			memberID = userID.substr(0, 3) === "<@!" ? userID.substr(3, userID.length - 4) : userID;
		}
		const userObj = await DiscordUtils.getGuildMember(memberID, interaction.guild!);

		const embed = userObj === undefined
			? this.buildNoMatchEmbed()
			: this.buildInspectEmbed(userObj!);

		await interaction.reply({embeds: [embed]});
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