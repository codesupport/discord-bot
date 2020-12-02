import axios from "axios";
import cache from "axios-cache-adapter";

export default class AdventOfCodeService {
	private static instance: AdventOfCodeService;
	private api = axios.create({
		adapter: cache.setupCache({
			maxAge: 15 * 60 * 1000
		}).adapter
	});

	static getInstance(): AdventOfCodeService {
		if (!this.instance) {
			this.instance = new AdventOfCodeService();
		}

		return this.instance;
	}

	async getLeaderBoard(leaderBoard: string, year: number): Promise<AocLeaderBoard> {
		const { ADVENT_OF_CODE_TOKEN } = process.env;
		const link = `https://adventofcode.com/${year}/leaderboard/private/view/${leaderBoard}.json`;

		const response = await this.api.get<AocLeaderBoard>(link, {
			headers: {
				"Cookie": `session=${ADVENT_OF_CODE_TOKEN};`
			}
		});

		if (!response.data.members) {
			throw Error("Advent Of code leaderboard not found");
		}

		return response.data;
	}
}
