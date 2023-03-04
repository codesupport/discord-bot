import {ColorResolvable, CommandInteraction, EmbedBuilder} from "discord.js";
import {Discord, Slash, SlashOption} from "discordx";
import InstantAnswerService from "../services/InstantAnswerService";
import getConfigValue from "../utils/getConfigValue";
import GenericObject from "../interfaces/GenericObject";

@Discord()
class SearchCommand {
	@Slash("search")
	async onInteract(
		@SlashOption("query", {type: "STRING", required: false}) query: string,
			interaction: CommandInteraction): Promise<void> {
		const embed = new EmbedBuilder();

		try {
			const InstantAnswer = InstantAnswerService.getInstance();
			const res = await InstantAnswer.query(query.replace(" ", "+"));

			if (res !== null) {
				const [baseURL] = res.url.match(/[a-z]*\.[a-z]*(\.[a-z]*)*/) || [];

				embed.setTitle(res.heading);
				embed.setDescription(`${res.description}\n\n[View on ${baseURL}](${res.url})`);
				embed.setFooter({ text: "Result powered by the DuckDuckGo API." });
				embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").SUCCESS);
			} else {
				embed.setTitle("Error");
				embed.setDescription("No results found.");
				embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").ERROR);
			}
		} catch (error) {
			embed.setTitle("Error");
			embed.setDescription("There was a problem querying DuckDuckGo.");
			embed.addFields([{ name: "Correct Usage", value: "/search <query>" }]);
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").ERROR);
		}
		await interaction.reply({embeds: [embed]});
	}
}

export default SearchCommand;