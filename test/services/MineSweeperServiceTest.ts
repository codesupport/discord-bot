import {createSandbox, SinonSandbox} from "sinon";
import {expect} from "chai";

import MineSweeperService from "../../src/services/MineSweeperService";

describe("MineSweeperService", () => {
	describe("::getInstance()", () => {
		it("returns an instance of MineSweeperService", () => {
			const service = MineSweeperService.getInstance();

			expect(service).to.be.instanceOf(MineSweeperService);
		});
	});

	describe("generateGame()", () => {
		let sandbox: SinonSandbox;
		let mineSweeperService: MineSweeperService;

		beforeEach(() => {
			sandbox = createSandbox();
			mineSweeperService = MineSweeperService.getInstance();
		});

		it("has the correct amount of cells", async () => {
			const result = mineSweeperService.generateGame(10);
			const count = (result.split("||")!.length - 1) / 2;

			expect(count).to.equal(121);
		});

		it("has the correct amount of bombs", async () => {
			const result = mineSweeperService.generateGame(1);
			const count = result.split(":boom:")!.length - 1;

			expect(count).to.equal(121);
		});

		it("returned string has no numbers", async () => {
			const result = mineSweeperService.generateGame(10);
			const hasNumber = (/\d/).test(result);

			expect(hasNumber).to.equal(false);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});