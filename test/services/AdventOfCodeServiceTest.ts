import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";

import AdventOfCodeService from "../../src/services/AdventOfCodeService";

const mockAPIData = {
	event: "2021",
	owner_id: "490120",
	members: {
		452251: {
			id: "452251",
			completion_day_level: {
				1: {
					1: {
						"get_star_ts": "1606818269"
					},
					2: {
						"get_star_ts": "1606818426"
					}
				}
			},
			local_score: 271,
			stars: 10,
			name: "JonaVDM",
			global_score: 0,
			last_star_ts: "1607148399"
		},
		490120: {
			last_star_ts: "1606910469",
			global_score: 0,
			name: "Lambo",
			local_score: 51,
			id: "490120",
			completion_day_level: {
				1: {
					1: {
						"get_star_ts": "1606816563"
					}
				}
			},
			stars: 4
		},
		500120: {
			last_star_ts: "0",
			global_score: 0,
			name: "Bob Pieter",
			local_score: 0,
			id: "500120",
			completion_day_level: {},
			stars: 0
		}
	}
};

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
				data: mockAPIData
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

	describe("getSingelPlayer()", () => {
		let sandbox: SinonSandbox;
		let aoc: AdventOfCodeService;

		beforeEach(() => {
			sandbox = createSandbox();
			aoc = AdventOfCodeService.getInstance();
		});

		it("performs a GET request to the Advent Of Code Api", async () => {
			const axiosGet = sandbox.stub(aoc.api, "get").resolves({
				status: 200,
				data: mockAPIData
			});

			await aoc.getLeaderBoard("leaderboard", 2021);

			expect(axiosGet.called).to.be.true;
		});

		it("returns the position and the member when the user exist on the leaderboard", async () => {
			sandbox.stub(aoc.api, "get").resolves({
				status: 200,
				data: mockAPIData
			});

			const [position, member] = await aoc.getSinglePlayer("leaderboard", 2021, "JonaVDM");

			expect(position).to.equal(1);
			expect(member.name).to.equal("JonaVDM");
		});

		it("finds the player if the name is weirdly capitalized", async () => {
			sandbox.stub(aoc.api, "get").resolves({
				status: 200,
				data: mockAPIData
			});

			const [position, member] = await aoc.getSinglePlayer("leaderboard", 2021, "lAmBo");

			expect(position).to.equal(2);
			expect(member.name).to.equal("Lambo");
		});

		it("finds the player when there are spaces in the name", async () => {
			sandbox.stub(aoc.api, "get").resolves({
				status: 200,
				data: mockAPIData
			});

			const [position, member] = await aoc.getSinglePlayer("leaderboard", 2021, "Bob Pieter");

			expect(position).to.equal(3);
			expect(member.name).to.equal("Bob Pieter");
		});

		it("returns 0 and undefined when the user does not exist on the leaderboard", async () => {
			sandbox.stub(aoc.api, "get").resolves({
				status: 200,
				data: mockAPIData
			});

			const [position, member] = await aoc.getSinglePlayer("leaderboard", 2021, "bob");

			expect(position).to.equal(0);
			expect(member).to.be.undefined;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
