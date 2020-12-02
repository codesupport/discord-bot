import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";

import AdventOfCodeService from "../../src/services/AdventOfCodeService";

describe("AdventOfCodeService", () => {
	describe("::getInstance()", () => {
		it("creates an instance of AdventOfCodeService", () => {
			const service = AdventOfCodeService.getInstance();

			expect(service).to.be.instanceOf(AdventOfCodeService);
		});
	});

	describe("getLeaderBoard()", () => {
		let sandbox: SinonSandbox;
		let aoc: AdventOfCodeService;

		beforeEach(() => {
			sandbox = createSandbox();
			aoc = AdventOfCodeService.getInstance();
		});

		it("performs a GET request to the Advent Of Code Api", async () => {
			const axiosGet = sandbox.stub(aoc.api, "get").resolves({
				status: 200,
				data: {
					event: "2021",
					owner_id: "490120",
					members: {
						490120: {
							completion_day_level: {
								1: {
									1: {
										get_star_ts: 1606816563
									}
								}
							},
							local_score: 26,
							global_score: 0,
							name: "Lambo",
							id: "490120",
							stars: 3,
							last_star_ts: "1606899444"
						}
					}
				}
			});

			await aoc.getLeaderBoard("leaderboard", 2021);

			expect(axiosGet.called).to.be.true;
		});

		it("throws an error if the API responds when not authorized", async () => {
			const axiosGet = sandbox.stub(aoc.api, "get").resolves({
				status: 500,
				data: {}
			});

			// Chai can't detect throws inside async functions. This is a hack to get it working.
			try {
				await aoc.getLeaderBoard("leaderboard", 2021);
			} catch ({ message }) {
				expect(message).to.equal("Advent Of code leaderboard not found");
			}

			expect(axiosGet.called).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
