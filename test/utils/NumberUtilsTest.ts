import { expect } from "chai";
import NumberUtils from "../../src/utils/NumberUtils";

describe("NumberUtils", () => {
	describe("::getRandomNumberInRange()", () => {
		it("Picks a random value between given min and max value", () => {
			const value = NumberUtils.getRandomNumberInRange(1, 5);

			expect(value).to.be.oneOf([1, 2, 3, 4, 5]);
		});
	});

	describe("::hexadecimalToInteger()", () => {
		it("Returns the decimal number from a hexadecimal value", () => {
			const value = NumberUtils.hexadecimalToInteger("8AB54D");

			expect(value).to.be.equal(9090381);
		});

		it("Returns the decimal number from a hexadecimal colour value", () => {
			const value = NumberUtils.hexadecimalToInteger("#1555B7");

			expect(value).to.be.equal(1398199);
		});
	});
});