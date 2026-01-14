import {ApplicationCommandType, EmbedBuilder, MessageContextMenuCommandInteraction, ChannelType, TextChannel, ActionRowBuilder, ButtonBuilder, ButtonStyle, ButtonInteraction } from "discord.js";
import { ContextMenu, Discord, ButtonComponent } from "discordx";
import getConfigValue from "../utils/getConfigValue";
//import GenericObject from "../interfaces/GenericObject";
//import App from "../app";
//import { log } from "console";
//import { channel } from "diagnostics_channel";

@Discord()
class ReportToMods {
	@ContextMenu({name: "Flag to moderators", type: ApplicationCommandType.Message, guilds: ["1213170850015084594"]})
	async onContext(interaction: MessageContextMenuCommandInteraction): Promise<void> {
		const logChannelId: string = getConfigValue<string>("LOG_CHANNEL_ID");

		const logChannelRaw = await interaction.client.channels.fetch(logChannelId);

		if (!logChannelRaw || logChannelRaw.type !== ChannelType.GuildText) {
			console.error("Invalid logChannel instance");
		}

		const logChannel = logChannelRaw as TextChannel;

		const reportedMessage = interaction.targetMessage;
		const messageLink = `https://discord.com/channels/${reportedMessage.guildId}/${reportedMessage.channelId}/${reportedMessage.id}`;

		const embed = new EmbedBuilder()
		.setTitle("Message flagged to moderators")
		.setDescription(reportedMessage.content.replace('*', '\\*') || "[*No message content*]")
		.addFields([
			{ name: "Author", value: `<@${reportedMessage.author.id}>`, inline: true },
			{ name: "Channel", value: `<#${reportedMessage.channelId}>`, inline: true },
			{ name: "Message Link", value: messageLink, inline: true }
		]);

		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId(`report:approve:${reportedMessage.channelId}:${reportedMessage.id}`)
				.setLabel("Approve")
				.setStyle(ButtonStyle.Success),

			new ButtonBuilder()
				.setCustomId(`report:reject:${reportedMessage.channelId}:${reportedMessage.id}`)
				.setLabel("Reject")
				.setStyle(ButtonStyle.Danger)
		);

		await logChannel.send({ embeds: [embed], components: [row] });

		await interaction.reply({
			content: "Message flagged to moderators.",
			ephemeral: true
		});
	}

	@ButtonComponent({ id: /^report:(approve|reject):\d+$/ })
	async onButton(interaction: ButtonInteraction): Promise<void> {
		const modRoleId = getConfigValue<string>("MOD_ROLE");
		
		const roles = interaction.member?.roles;
		
		const hasRole = Array.isArray(roles)
			? roles?.includes(modRoleId)
			: roles?.cache.has(modRoleId);

		if (!hasRole) {
		await interaction.reply({
			content: "You do not have permission to perform this action.",
			ephemeral: true
		});
		return;
		}
	
		const [, action, channelId, messageId] = interaction.customId.split(":");

		if (action === "approve") {
			const channel = await interaction.client.channels.fetch(channelId);

			if (!channel || !channel.isTextBased()) {
				await interaction.reply({
					content: "Cannot resolve channel.",
					ephemeral: true
				});
				return;
			}

			const message = await channel.messages.fetch(messageId);
			await message.delete();
		}
	
		await interaction.update({
		content:
			action === "approve"
			? `✅ Report approved by <@${interaction.user.id}>`
			: `❌ Report rejected by <@${interaction.user.id}>`,
		components: [] // disable buttons
		});
	}
}

export default ReportToMods;
