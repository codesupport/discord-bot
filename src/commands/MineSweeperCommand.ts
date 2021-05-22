import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";
import { EMBED_COLOURS } from "../config.json";
import MineSweeperService from "../services/MineSweeperService";

class MineSweeperCommand extends Command {
	constructor() {
		super(
			"minesweeper",
			"generates a minesweeper"
		);
	}

	async run(message: Message, args: string[]) {
		const embed = new MessageEmbed();
		const mineSweeperService = MineSweeperService.getInstance();

		if (!args[0]) args[0] = "easy";

		interface DifficultyLevel {
			[key: string]: {display: string, ratio: number}
		}

		const difficultyLevels: DifficultyLevel = {
			"easy": {display: "Easy", ratio: 7},
			"medium": {display: "Medium", ratio: 5},
			"hard": {display: "Hard", ratio: 3}
		};

		if (Object.keys(difficultyLevels).includes(args[0].toLowerCase())) {
			const difficulty = difficultyLevels[args[0].toLowerCase()];

			embed.setTitle(`MineSweeper (${difficulty.display})`);
			embed.setDescription(mineSweeperService.generateGame(11, 11, difficulty.ratio));
			embed.setColor(EMBED_COLOURS.DEFAULT);
		} else {
			embed.setTitle("Error");
			embed.setDescription("You must provide an existing difficulty");
			embed.addField("Correct Usage", "?minesweeper [easy|medium|hard]");
			embed.setColor(EMBED_COLOURS.ERROR);
		}

		await message.channel.send({ embed });
	}
}

export default MineSweeperCommand;