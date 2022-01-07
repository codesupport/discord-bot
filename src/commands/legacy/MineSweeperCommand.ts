import {ColorResolvable, Message, MessageEmbed} from "discord.js";
import Command from "../../abstracts/Command";
import MineSweeperService from "../../services/MineSweeperService";
import StringUtils from "../../utils/StringUtils";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";

class MineSweeperCommand extends Command {
	constructor() {
		super(
			"minesweeper",
			"Generates a minesweeper game."
		);
	}

	async run(message: Message, args: string[]) {
		const embed = new MessageEmbed();
		const mineSweeperService = MineSweeperService.getInstance();

		if (!args[0]) args[0] = "easy";
		const givenDifficulty = args[0].toLowerCase();

		const difficultyLevels: {[key: string]: number} = {
			"easy": 7,
			"medium": 5,
			"hard": 3
		};

		if (Object.keys(difficultyLevels).includes(givenDifficulty)) {
			const difficulty = difficultyLevels[givenDifficulty];

			embed.setTitle(`MineSweeper (${StringUtils.capitalise(givenDifficulty)})`);
			embed.setDescription(mineSweeperService.generateGame(difficulty));
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT);
		} else {
			embed.setTitle("Error");
			embed.setDescription("You must provide an existing difficulty.");
			embed.addField("Correct Usage", "?minesweeper [easy|medium|hard]");
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").ERROR);
		}

		await message.channel.send({ embeds: [embed] });
	}
}

export default MineSweeperCommand;