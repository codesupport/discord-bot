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

		embed.setTitle("MineSweeper");
		embed.setDescription(mineSweeperService.generateGame(9, 9, 5));
		embed.setColor(EMBED_COLOURS.DEFAULT);

		await message.channel.send({ embed });
	}
}

export default MineSweeperCommand;