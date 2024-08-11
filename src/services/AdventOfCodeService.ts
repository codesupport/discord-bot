import {AxiosCacheInstance } from "axios-cache-interceptor";
import { injectable as Injectable, inject as Inject } from "tsyringe";
import { AOCLeaderBoard, AOCMember } from "../interfaces/AdventOfCode";

@Injectable()
export default class AdventOfCodeService {
	constructor(
		@Inject("AXIOS_CACHED_INSTANCE")
		private readonly api: AxiosCacheInstance
	) {}

	async getLeaderBoard(leaderBoard: string, year: number): Promise<AOCLeaderBoard> {
		const { ADVENT_OF_CODE_TOKEN } = process.env;
		const link = `https://adventofcode.com/${year}/leaderboard/private/view/${leaderBoard}.json`;

		const response = await this.api.get<AOCLeaderBoard>(link, {
			headers: {
				"Cookie": `session=${ADVENT_OF_CODE_TOKEN};`,
				"User-Agent": `github.com/codesupport/discord-bot by ${process.env.CONTACT_EMAIL}`
			},
			cache: {
				ttl: 15 * 60 * 1000
			}
		});

		if (!response.data.members) {
			throw Error("Advent Of code leaderboard not found");
		}

		return response.data;
	}

	async getSortedPlayerList(leaderBoard: string, year: number): Promise<AOCMember[]> {
		const data = await this.getLeaderBoard(leaderBoard, year);
		const members: AOCMember[] = Object.values(data.members);

		members.sort((a, b) => {
			const stars = b.stars - a.stars;

			return !stars ? b.local_score - a.local_score : stars;
		});

		return members;
	}

	async getSinglePlayer(leaderBoard: string, year: number, name: string): Promise<[number, AOCMember]> {
		const board = await this.getSortedPlayerList(leaderBoard, year);
		const memberIndex = board.findIndex(member => member.name?.toLocaleLowerCase() === name.toLocaleLowerCase());

		return [memberIndex + 1, board[memberIndex]];
	}
}
