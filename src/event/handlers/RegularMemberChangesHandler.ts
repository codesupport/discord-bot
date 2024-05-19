import { EmbedBuilder, Events, GuildMember, TextChannel } from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import getConfigValue from "../../utils/getConfigValue";

class RegularMemberChangesHandler extends EventHandler {
	constructor() {
		super(Events.GuildMemberUpdate);
	}

	async handle(oldMember: GuildMember, newMember: GuildMember) {
		if (oldMember.roles.cache.size === newMember.roles.cache.size) {
			return;
		}

		const roleId = getConfigValue<string>("REGULAR_ROLE");
		const hadRoleBefore = oldMember.roles.cache.has(roleId);
		const hasRoleNow = newMember.roles.cache.has(roleId);

		if (hadRoleBefore && hasRoleNow || !hadRoleBefore && !hasRoleNow) {
			return;
		}

		const channelId = getConfigValue<string>("REGULAR_ROLE_CHANGE_CHANNEL");
		const logChannel = await newMember.guild.channels.fetch(channelId) as TextChannel;

		const embed = new EmbedBuilder();

		embed.setThumbnail(newMember.user.avatarURL());
		embed.setDescription(`<@${newMember.user.id}>`);

		if (hadRoleBefore && !hasRoleNow) {
			embed.setTitle("No Longer Regular");
			embed.setColor("#F71313");
		}

		if (!hadRoleBefore && hasRoleNow) {
			embed.setTitle("New Regular Member");
			embed.setColor("#6CEF0E");
		}

		logChannel?.send({ embeds: [embed] });
	}
}

export default RegularMemberChangesHandler;
