import {Discord, Slash, SlashOption} from "discordx";
import {MessageEmbed, ColorResolvable, CommandInteraction, GuildMember, Formatters} from "discord.js";
import getConfigValue from "../utils/getConfigValue";
import GenericObject from "../interfaces/GenericObject";
import DiscordUtils from "../utils/DiscordUtils";

@Discord()
class InspectCommand {
	@Slash("inspect")
	async onInteract(
		@SlashOption("user", {type: "MENTIONABLE", required: false}) userID: GuildMember,
			interaction: CommandInteraction): Promise<void> {
		const userObj = await DiscordUtils.getGuildMember(userID === undefined ? interaction.user.id : userID.id, interaction.guild!);

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

		if (memberObj?.joinedAt !== null) {
			const shortDateTime = Formatters.time(memberObj?.joinedAt!, Formatters.TimestampStyles.ShortDateTime);
			const relativeTime = Formatters.time(memberObj?.joinedAt!, Formatters.TimestampStyles.RelativeTime);

			embed.addField("Joined At", `${shortDateTime} ${relativeTime}`);
		}

		if (memberObj?.roles.cache.size > 1) {
			embed.addField("Roles", `${memberObj.roles.cache.filter(role => role.id !== memberObj?.guild!.id).map(role => ` ${role.toString()}`)}`);
		} else {
			embed.addField("Roles", "No roles");
		}

		return embed;
	}
}

export default InspectCommand;