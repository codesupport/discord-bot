import { ColorResolvable, Constants, GuildMember, MessageEmbed, TextChannel, Snowflake } from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import DateUtils from "../../utils/DateUtils";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";

class LogMemberLeaveHandler extends EventHandler {
	constructor() {
		super(Constants.Events.GUILD_MEMBER_REMOVE);
	}

	async handle(guildMember: GuildMember): Promise<void> {
		const embed = new MessageEmbed();

		embed.setTitle("Member Left");
		embed.setDescription(`User: ${guildMember.user}`);
		embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT);
		embed.addField("Join Date", new Date(guildMember.joinedTimestamp!).toLocaleString(), true);
		embed.addField("Leave Date", new Date(Date.now()).toLocaleString(), true);
		embed.addField("Time In Server", DateUtils.getFormattedTimeSinceDate(guildMember.joinedAt!, new Date(Date.now()))!);
		embed.addField("Authenticated", guildMember.roles.cache.has(getConfigValue<Snowflake>("MEMBER_ROLE")) ? "True" : "False");

		const logsChannel = guildMember.guild?.channels.cache.find(
			channel => channel.id === getConfigValue<string>("LOG_CHANNEL_ID")
		) as TextChannel;

		await logsChannel?.send({embeds: [embed]});
	}
}

export default LogMemberLeaveHandler;
