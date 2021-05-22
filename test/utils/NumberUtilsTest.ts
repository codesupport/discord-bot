import { expect } from "chai";
import NumberUtils from "../../src/utils/NumberUtils";

describe("NumberUtils", () => {
	describe("::getRandomNumberInRange()", () => {
		it("Picks a random value between given min and max value", () => {
			const value = NumberUtils.getRandomNumberInRange(1, 5);

			expect(value).to.be.oneOf([1, 2, 3, 4, 5]);
		});
	});
});