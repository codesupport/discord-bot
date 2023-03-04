import {Discord, Slash, SlashOption} from "discordx";
import {EmbedBuilder, ColorResolvable, CommandInteraction, GuildMember, Formatters} from "discord.js";
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

	private buildNoMatchEmbed(): EmbedBuilder {
		const embed = new EmbedBuilder();

		embed.setTitle("Error");
		embed.setDescription("No match found.");
		embed.addFields([{ name: "Correct Usage", value: "?inspect [username|userID]" }]);
		embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").ERROR);

		return embed;
	}

	private buildInspectEmbed(memberObj: GuildMember): EmbedBuilder {
		const embed = new EmbedBuilder();

		embed.setTitle(`Inspecting ${memberObj?.user.tag}`);
		embed.setColor(<ColorResolvable>(memberObj?.displayColor || getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT));
		embed.setThumbnail(memberObj?.user.displayAvatarURL());
		embed.addFields([
			{ name: "User ID", value: memberObj?.user.id },
			{ name: "Username", value: memberObj?.user.tag }
		]);

		if (memberObj?.nickname !== null) embed.addFields([{ name: "Nickname", value: memberObj?.nickname }]);

		if (memberObj?.joinedAt !== null) {
			const shortDateTime = Formatters.time(memberObj?.joinedAt!, Formatters.TimestampStyles.ShortDateTime);
			const relativeTime = Formatters.time(memberObj?.joinedAt!, Formatters.TimestampStyles.RelativeTime);

			embed.addFields([{ name: "Joined At", value: `${shortDateTime} ${relativeTime}` }]);
		}

		if (memberObj?.roles.cache.size > 1) {
			embed.addFields([{ name: "Roles", value: `${memberObj.roles.cache.filter(role => role.id !== memberObj?.guild!.id).map(role => ` ${role.toString()}`)}` }]);
		} else {
			embed.addFields([{ name: "Roles", value: "No roles" }]);
		}

		return embed;
	}
}

export default InspectCommand;