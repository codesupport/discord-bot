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

		let antiSpamChannel = await message.guild.channels.fetch(antiSpamChannelId) as TextChannel;

		if (!antiSpamChannel) { // Retry loop
			let tries = 0;
			let success = 0;

			while (tries <= 3) {
				antiSpamChannel = await message.guild.channels.fetch(antiSpamChannelId) as TextChannel;
				if (antiSpamChannel) {
					success = 1;
					break;
				}
				tries += 1;
			}
			if (!success) {
				logger.error("Failed to increment counter");
				try {
					await member.ban({deleteMessageSeconds: 60 * 60, reason: "Member posted in anti-spam channel"});

					const logsChannel = await message.guild.channels.fetch(logsChannelId) as TextChannel;

					await logsChannel.send(`User ${member.user.username} (\`${member.id}\`) was banned for posting in <#${antiSpamChannelId}>. Their recent messages have been deleted.`);
				} catch (error) {
					logger.error("AntiSpamHandler error", {error});
				}
				return;
			}
		}
		const antiSpamMessages = await antiSpamChannel.messages.fetch({ limit: 100 });
		// Check if any of those messages were sent by THIS bot
		const hasSentMessageInAntiSpamChannel = antiSpamMessages.some(msg => msg.author.id === message.client.user?.id);

		if (hasSentMessageInAntiSpamChannel && antiSpamMessages.find(msg => msg.author.id === message.client.user?.id)) {
			const botMessage = antiSpamMessages.find(msg => msg.author.id === message.client.user?.id);
			const botMessageContent = botMessage!.content;
			const counterValueStr = botMessageContent.split(" ")[0].replace(/\D/g, "");
			const counterValueInt = parseInt(counterValueStr, 10);

			botMessage!.edit(`**${counterValueInt + 1}** spam accounts banned.`);
		} else {
			antiSpamChannel.send("**1** spam account has been banned.");
		}

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
