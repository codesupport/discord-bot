import { Constants, GuildMember, MessageEmbed, TextChannel } from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import { EMBED_COLOURS, MEMBER_ROLE, LOG_CHANNEL_ID } from "../../config.json";
import DateUtils from "../../utils/DateUtils";

class LogMemberLeaveHandler extends EventHandler {
	constructor() {
		super(Constants.Events.GUILD_MEMBER_REMOVE);
	}

	async handle(guildMember: GuildMember): Promise<void> {
		const embed = new MessageEmbed();

		embed.setTitle("Member Left");
		embed.setDescription(`User: ${guildMember.user}`);
		embed.setColor(EMBED_COLOURS.DEFAULT);
		embed.addField("Join Date", new Date(guildMember.joinedTimestamp!).toLocaleString(), true);
		embed.addField("Leave Date", new Date(Date.now()).toLocaleString(), true);
		embed.addField("Time In Server", DateUtils.getFormattedTimeSinceDate(guildMember.joinedAt!, new Date(Date.now()))!);
		embed.addField("Authenticated", guildMember.roles.cache.has(MEMBER_ROLE) ? "True" : "False");

		const logsChannel = guildMember.guild?.channels.cache.find(channel => channel.id === LOG_CHANNEL_ID) as TextChannel;

		await logsChannel?.send({embeds: [embed]});
	}
}

export default LogMemberLeaveHandler;
