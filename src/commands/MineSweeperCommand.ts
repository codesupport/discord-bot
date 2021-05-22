import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";
import { EMBED_COLOURS } from "../config.json";
import MineSweeperService from "../services/MineSweeperService";
import StringUtils from "../utils/StringUtils";

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

		interface DifficultyLevel {
			[key: string]: {ratio: number}
		}

		const difficultyLevels: DifficultyLevel = {
			"easy": {ratio: 7},
			"medium": {ratio: 5},
			"hard": {ratio: 3}
		};

		if (Object.keys(difficultyLevels).includes(args[0].toLowerCase())) {
			const difficulty = difficultyLevels[args[0].toLowerCase()];

			embed.setTitle(`MineSweeper (${StringUtils.capitalise(args[0].toLowerCase())})`);
			embed.setDescription(mineSweeperService.generateGame(11, 11, difficulty.ratio));
			embed.setColor(EMBED_COLOURS.DEFAULT);
		} else {
			embed.setTitle("Error");
			embed.setDescription("You must provide an existing difficulty.");
			embed.addField("Correct Usage", "?minesweeper [easy|medium|hard]");
			embed.setColor(EMBED_COLOURS.ERROR);
		}

		await message.channel.send({ embed });
	}
}

export default MineSweeperCommand;