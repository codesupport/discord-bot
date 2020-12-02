import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";
import AdventOfCodeService from "../services/AdventOfCodeService";
import { EMBED_COLOURS, ADVENT_OF_CODE_LEADERBOARD, ADVENT_OF_CODE_YEAR, ADVENT_OF_CODE_INVITE } from "../config.json";
import { AOCMember } from "../interfaces/AdventOfCode";

class AdventOfCodeCommand extends Command {
	constructor() {
		super(
			"adventofcode",
			"Shows the current leaderboard for adventofcode.",
			{
				aliases: ["aoc"]
			},
		);
	}

	private getNameLength(members: AOCMember[]): number {
		return members.reduce((a, b) => {
			const nameLengthA = a.name?.length || 0;
			const nameLengthB = b.name?.length || 0;

			return nameLengthA > nameLengthB ? a : b;
		}).name?.length || 15;
	}

	private getStarNumberLength(members: AOCMember[]): number {
		return members.reduce((a, b) => {
			if (a.stars.toString().length > b.stars.toString().length) {
				return a;
			}
			return b;
		}).stars.toString().length;
	}

	private generatePlayerList(members: AOCMember[], listLength: number): string {
		let list = "```java\n(Name, Stars, Points)\n";

		const memberNameLength = this.getNameLength(members);
		const starLength = this.getStarNumberLength(members);

		for (let i = 0; i < listLength; i++) {
			const member = members[i];

			if (member) {
				const name = !member.name ? member.id : member.name.padEnd(memberNameLength, " ");
				const score = member.local_score;
				const stars = member.stars.toString().padEnd(starLength);

				list = list.concat(`${name} | ${stars} | ${score}\n`);
			}
		}

		return list.concat("```");
	}

	async run(message: Message): Promise<void> {
		const amountInTopList = 15;
		const link = `https://adventofcode.com/${ADVENT_OF_CODE_YEAR}/leaderboard/private/view/${ADVENT_OF_CODE_LEADERBOARD}`;
		const embed = new MessageEmbed();

		try {
			const adventOfCodeService = AdventOfCodeService.getInstance();
			const members = await adventOfCodeService.getSortedPlayerList(ADVENT_OF_CODE_LEADERBOARD, ADVENT_OF_CODE_YEAR);

			const playerList = this.generatePlayerList(members, amountInTopList);
			const description = `Leaderboard ID: \`${ADVENT_OF_CODE_INVITE}\`\n\n[View Leaderboard](${link})`;

			embed.setTitle("Advent Of Code");
			embed.setDescription(description);
			embed.addField("Top 15", playerList);
			embed.setColor(EMBED_COLOURS.SUCCESS);
		} catch {
			embed.setTitle("Error");
			embed.setDescription("Could not get the leaderboard for Advent Of Code.");
			embed.setColor(EMBED_COLOURS.ERROR);
		}

		await message.channel.send({ embed });
	}
}

export default AdventOfCodeCommand;
