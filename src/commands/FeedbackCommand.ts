import { Discord, ModalComponent, Slash } from "discordx";
import { ActionRowBuilder, CommandInteraction, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, TextChannel, TextInputBuilder } from "discord.js";
import getConfigValue from "../utils/getConfigValue";

@Discord()
class FeedbackCommand {
	@Slash({
		name: "feedback",
		description: "Leave anonymous feedback around the community"
	})
	async onInteract(
		interaction: CommandInteraction
	): Promise<void> {
		const modal = new ModalBuilder()
			.setTitle("Anonymous Feedback")
			.setCustomId("feedback-form");

		const feedbackInput = new TextInputBuilder()
			.setCustomId("feedback-input")
			.setLabel("Your Feedback")
			.setStyle(2);

		modal.addComponents(
			new ActionRowBuilder<TextInputBuilder>().addComponents(
				feedbackInput
			)
		);

		await interaction.showModal(modal);
	}

	@ModalComponent({
		id: "feedback-form"
	})
	async onModalSubmit(interaction: ModalSubmitInteraction): Promise<void> {
		const [feedbackInput] = ["feedback-input"].map(id => interaction.fields.getTextInputValue(id));

		const feedbackChannelId = getConfigValue<string>("FEEDBACK_CHANNEL");
		const feedbackChannel = await interaction.guild?.channels.fetch(feedbackChannelId) as TextChannel;

		const embed = new EmbedBuilder();

		embed.setTitle("New Anonymous Feedback");
		embed.setDescription(feedbackInput);

		const message = await feedbackChannel?.send({
			embeds: [embed]
		});

		await message.startThread({
			name: "Discuss Anonymous Feedback"
		});

		await interaction.reply({
			content: "Thank you, the following feedback has been submitted:",
			ephemeral: true,
			embeds: [embed]
		});
	}
}

export default FeedbackCommand;
