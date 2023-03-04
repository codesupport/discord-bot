import { ColorResolvable, Events, GuildMember, EmbedBuilder, TextChannel, Snowflake } from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import DateUtils from "../../utils/DateUtils";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";

class LogMemberLeaveHandler extends EventHandler {
	constructor() {
		super(Events.GuildMemberRemove);
	}

	async handle(guildMember: GuildMember): Promise<void> {
		const embed = new EmbedBuilder();

		embed.setTitle("Member Left");
		embed.setDescription(`User: ${guildMember.user}`);
		embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT);
		embed.addFields([
			{ name: "Join Date", value: new Date(guildMember.joinedTimestamp!).toLocaleString(), inline: true },
			{ name: "Leave Date", value: new Date(Date.now()).toLocaleString(), inline: true },
			{ name: "Time In Server", value: DateUtils.getFormattedTimeSinceDate(guildMember.joinedAt!, new Date(Date.now()))! },
			{ name: "Authenticated", value: guildMember.roles.cache.has(getConfigValue<Snowflake>("MEMBER_ROLE")) ? "True" : "False" }
		]);

		const logsChannel = guildMember.guild?.channels.cache.find(
			channel => channel.id === getConfigValue<string>("LOG_CHANNEL_ID")
		) as TextChannel;

		await logsChannel?.send({embeds: [embed]});
	}
}

export default LogMemberLeaveHandler;
