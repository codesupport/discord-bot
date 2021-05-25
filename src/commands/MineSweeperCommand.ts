import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";
import { EMBED_COLOURS, CHANNELS } from "../config.json";
import MineSweeperService from "../services/MineSweeperService";
import StringUtils from "../utils/StringUtils";

class MineSweeperCommand extends Command {
	constructor() {
		super(
			"minesweeper",
			"Generates a minesweeper game.",
			{
				whitelistedChannels: [CHANNELS.BOT_CHAT]
			}
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