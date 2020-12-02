import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";
import AdventOfCodeService from "../services/AdventOfCodeService";
import { EMBED_COLOURS, ADVENTOFCODE_LEADERBOARD, ADVENTOFCODE_YEAR, ADVENTOFCODE_INVITE } from "../config.json";

class AdventofcodeCommand extends Command {
	constructor() {
		super(
			"Adventofcode",
			"Shows the current leaderboard for adventofcode.",
			{
				aliases: ["aoc"]
			},
		);
	}

	async run(message: Message): Promise<void> {
		const amountInTopList = 15;
		const link = `https://adventofcode.com/${ADVENTOFCODE_YEAR}/leaderboard/private/view/${ADVENTOFCODE_LEADERBOARD}`;
		const embed = new MessageEmbed();

		try {
			const oac = AdventOfCodeService.getInstance();
			const response = await oac.getLeaderBoard(ADVENTOFCODE_LEADERBOARD, ADVENTOFCODE_YEAR);

			// Set members as a array for sorting
			const members: AocMember[] = Object.values(response.members);

			members.sort((a, b) => {
				const stars = b.stars - a.stars;

				return !stars ? b.local_score - a.local_score : stars;
			});

			// Get the max length sentence for members and stars
			const memberNameLength = members.reduce((a, b) => {
				const nameLengthA = a.name?.length || 0;
				const nameLengthB = b.name?.length || 0;

				return nameLengthA > nameLengthB ? a : b;
			}).name?.length as number;

			const starLength = members.reduce((a, b) => {
				if (a.stars.toString().length > b.stars.toString().length) {
					return a;
				}
				return b;
			}).stars.toString().length;

			let playerList = "```java\n(Name, Stars, Points)\n";

			for (let i = 0; i < amountInTopList; i++) {
				const member = members[i];

				if (member) {
					const name = !member.name ? member.id : member.name.padEnd(memberNameLength, " ");
					const score = member.local_score;
					const stars = member.stars.toString().padEnd(starLength);

					playerList = playerList.concat(`${name} | ${stars} | ${score}\n`);
				}
			}

			playerList = playerList.concat("```");

			const description = `Leaderboard ID: \`${ADVENTOFCODE_INVITE}\`\n\n[View Leaderboard](${link})`;

			embed.setTitle("Advent Of Code");
			embed.setDescription(description);
			embed.addField("Top 15", playerList);
			embed.setColor(EMBED_COLOURS.SUCCESS);
		} catch {
			embed.setTitle("Error");
			embed.setDescription("Could not get the leaderboard for Advent Of Code.");
			embed.setColor(EMBED_COLOURS.ERROR);
		}
		message.channel.send({ embed });
	}
}

export default AdventofcodeCommand;
