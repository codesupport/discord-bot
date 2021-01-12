import { Constants, GuildMember, MessageEmbed, TextChannel } from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import { EMBED_COLOURS } from "../../config.json";
import DateUtils from "../../utils/DateUtils";

class LogMemberLeaveHandler extends EventHandler {
	constructor() {
		super(Constants.Events.GUILD_MEMBER_REMOVE);
	}

	async handle(guildMember: GuildMember): Promise <void> {
		const embed = new MessageEmbed();

		embed.setTitle(`${guildMember.user.tag} left the server.`);
		embed.setColor(EMBED_COLOURS.DEFAULT);
		embed.addField("Join date", new Date(guildMember.joinedTimestamp!).toLocaleString(), true);
		embed.addField("Leave date", new Date(Date.now()).toLocaleString(), true);
		embed.addField("Time elapsed", DateUtils.getFormattedTimeSinceEpoch(guildMember.joinedTimestamp!));

		if (guildMember?.roles.cache.size > 1) {
			embed.addField("Roles", `${guildMember.roles.cache.filter(role => role.id !== guildMember?.guild!.id).map(role => ` ${role.toString()}`)}`);
		} else {
			embed.addField("Roles", "No roles");
		}

		const logsChannel = guildMember.guild?.channels.cache.find(channel => channel.id === "772542546282807316") as TextChannel;

		await logsChannel?.send({embed});
	}
}

export default LogMemberLeaveHandler;