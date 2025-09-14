import {Events, Message, TextChannel} from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import {logger} from "../../logger";
import getConfigValue from "../../utils/getConfigValue";

class AntiSpamHandler extends EventHandler {
	constructor() {
		super(Events.MessageCreate);
	}

	handle = async (message: Message): Promise<void> => {
		const antiSpamChannelId = getConfigValue<string>("ANTISPAM_CHANNEL_ID");
		const logsChannelId = getConfigValue<string>("LOG_CHANNEL_ID");

		if (message.author.bot ||
			message.channel.id !== antiSpamChannelId ||
			!message.guild ||
			!message.member) {
			return;
		}

		const member = message.member;

		try {
			await member.ban({deleteMessageSeconds: 60 * 60, reason: "Member posted in anti-spam channel"});

			const logsChannel = await message.guild.channels.fetch(logsChannelId) as TextChannel;

			await logsChannel.send(`User ${member.user.username} (\`${member.id}\`) was banned for posting in <#${antiSpamChannelId}>. Their recent messages have been deleted.`);
		} catch (error) {
			logger.error("AntiSpamHandler error", {error});
		}
	};
}

export default AntiSpamHandler;
