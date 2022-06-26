import { ColorResolvable, MessageEmbed, CommandInteraction } from "discord.js";
import AdventOfCodeService from "../../services/AdventOfCodeService";
import { AOCMember } from "../../interfaces/AdventOfCode";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";
import {Discord, Slash, SlashOption} from "discordx";

@Discord()
class AdventOfCodeCommand {
	@Slash("aoc", {description: "Advent of Code"})
	async onInteract(
		@SlashOption("year", {type: "NUMBER", minValue: 2015, required: false}) year: number,
		@SlashOption("username", {type: "STRING", required: false}) username: string,
			interaction: CommandInteraction): Promise<void> {
		let yearToQuery = this.getYear();
		const adventOfCodeService = AdventOfCodeService.getInstance();
		const embed = new MessageEmbed();

		if (!!year && year <= yearToQuery) {
			yearToQuery = year;
		} else if (!!year) {
			await interaction.reply({embeds: [this.errorEmbed(`Year requested not available.\nPlease query a year between 2015 and ${yearToQuery}`)], ephemeral: true});
			return;
		}

		const link = `https://adventofcode.com/${yearToQuery}/leaderboard/private/view/${getConfigValue<string>("ADVENT_OF_CODE_LEADERBOARD")}`;
		const description = `Leaderboard ID: \`${getConfigValue<string>("ADVENT_OF_CODE_INVITE")}\`\n\n[View Leaderboard](${link})`;

		if (!!username) {
			try {
				const [position, user] = await adventOfCodeService.getSinglePlayer(getConfigValue<string>("ADVENT_OF_CODE_LEADERBOARD"), yearToQuery, username);

				if (!user) {
					await interaction.reply({embeds: [this.errorEmbed("Could not get the user requested\nPlease make sure you typed the name correctly")], ephemeral: true});
					return;
				}

				embed.setTitle("Advent Of Code");
				embed.setDescription(description);
				embed.addField(`Scores of ${user.name}`, "\u200B");
				embed.addField("Position", position.toString(), true);
				embed.addField("Stars", user.stars.toString(), true);
				embed.addField("Points", user.local_score.toString(), true);
				embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").SUCCESS);

				await interaction.reply({embeds: [embed]});
				return;
			} catch {
				await interaction.reply({embeds: [this.errorEmbed(`Could not get the Advent Of Code statistics for ${username} for the year ${yearToQuery}.`)], ephemeral: true});
				return;
			}
		}

		try {
			const members = await adventOfCodeService.getSortedPlayerList(getConfigValue<string>("ADVENT_OF_CODE_LEADERBOARD"), yearToQuery);
			const playerList = this.generatePlayerList(members, getConfigValue<number>("ADVENT_OF_CODE_RESULTS_PER_PAGE"));

			embed.setTitle("Advent Of Code");
			embed.setDescription(description);
			embed.addField(`Top ${getConfigValue<number>("ADVENT_OF_CODE_RESULTS_PER_PAGE")}`, playerList);
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").SUCCESS);
		} catch {
			await interaction.reply({embeds: [this.errorEmbed("Could not get the leaderboard for Advent Of Code.")], ephemeral: true});
			return;
		}

		await interaction.reply({embeds: [embed]});
	}

	getYear() {
		const date = new Date();

		if (date.getMonth() >= 10) {
			return date.getFullYear();
		}

		return date.getFullYear() - 1;
	}

	private getNameLength(members: AOCMember[]): number {
		const member = members.reduce((a, b) => {
			const nameLengthA = a.name?.length || `(anon) #${a.id}`.length;
			const nameLengthB = b.name?.length || `(anon) #${b.id}`.length;

			return nameLengthA > nameLengthB ? a : b;
		});

		return member.name?.length || `(anon) #${member.id}`.length;
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
				const name = !member.name ? `(anon) #${member.id}`.padEnd(memberNameLength) : member.name.padEnd(memberNameLength, " ");
				const score = member.local_score;
				const stars = member.stars.toString().padEnd(starLength);
				const position = (i + 1).toString().padStart(2, " ");

				list = list.concat(`${position}) ${name} | ${stars} | ${score}\n`);
			}
		}

		return list.concat("```");
	}

	private errorEmbed(description: string): MessageEmbed {
		const embed = new MessageEmbed();

		embed.setTitle("Error");
		embed.setDescription(description);
		embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").ERROR);

		return embed;
	}
}

export default AdventOfCodeCommand;