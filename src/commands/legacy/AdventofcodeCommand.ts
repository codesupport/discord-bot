import { ColorResolvable, Message, MessageEmbed } from "discord.js";
import Command from "../../abstracts/Command";
import AdventOfCodeService from "../../services/AdventOfCodeService";
import { AOCMember } from "../../interfaces/AdventOfCode";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";

class AdventOfCodeCommand extends Command {
	constructor() {
		super(
			"adventofcode",
			"Shows the current leaderboard for adventofcode.",
			{
				aliases: ["aoc"]
			}
		);
	}

	getYear() {
		const date = new Date();

		if (date.getMonth() >= 10) {
			return date.getFullYear();
		}

		return date.getFullYear() - 1;
	}

	async run(message: Message, args: string[]): Promise<void> {
		let year = this.getYear();
		const queriedYear = Number(args[0]);
		const embed = new MessageEmbed();
		const adventOfCodeService = AdventOfCodeService.getInstance();

		if (queriedYear && queriedYear >= 2015 && queriedYear <= year) {
			year = queriedYear;
		} else if (queriedYear) {
			embed.setTitle("Error");
			embed.setDescription(`Year requested not available.\nPlease query a year between 2015 and ${year}`);
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").ERROR);
			await message.channel.send({embeds: [embed]});

			return;
		}

		const link = `https://adventofcode.com/${year}/leaderboard/private/view/${getConfigValue<string>("ADVENT_OF_CODE_LEADERBOARD")}`;
		const description = `Leaderboard ID: \`${getConfigValue<string>("ADVENT_OF_CODE_INVITE")}\`\n\n[View Leaderboard](${link})`;

		if (!queriedYear && args[0]) {
			const name = args.join(" ");
			const [position, user] = await adventOfCodeService.getSinglePlayer(getConfigValue<string>("ADVENT_OF_CODE_LEADERBOARD"), year, name);

			if (!user) {
				embed.setTitle("Error");
				embed.setDescription("Could not get the user requested\nPlease make sure you typed the name correctly");
				embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").ERROR);

				await message.channel.send({embeds: [embed]});
				return;
			}

			embed.setTitle("Advent Of Code");
			embed.setDescription(description);
			embed.addField(`Scores of ${user.name}`, "\u200B");
			embed.addField("Position", position.toString(), true);
			embed.addField("Stars", user.stars.toString(), true);
			embed.addField("Points", user.local_score.toString(), true);
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").SUCCESS);

			await message.channel.send({embeds: [embed]});
			return;
		}

		try {
			const members = await adventOfCodeService.getSortedPlayerList(getConfigValue<string>("ADVENT_OF_CODE_LEADERBOARD"), year);

			const playerList = this.generatePlayerList(members, getConfigValue<number>("ADVENT_OF_CODE_RESULTS_PER_PAGE"));

			embed.setTitle("Advent Of Code");
			embed.setDescription(description);
			embed.addField(`Top ${getConfigValue<number>("ADVENT_OF_CODE_RESULTS_PER_PAGE")}`, playerList);
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").SUCCESS);
		} catch {
			embed.setTitle("Error");
			embed.setDescription("Could not get the leaderboard for Advent Of Code.");
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").ERROR);
		}

		await message.channel.send({embeds: [embed]});
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
				const position = (i + 1).toString().padStart(2, " ");

				list = list.concat(`${position}) ${name} | ${stars} | ${score}\n`);
			}
		}

		return list.concat("```");
	}
}

export default AdventOfCodeCommand;
