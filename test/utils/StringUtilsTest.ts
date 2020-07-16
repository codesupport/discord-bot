import { expect } from "chai";
import StringUtils from "../../src/utils/StringUtils";

describe("StringUtils", () => {
	describe("::capitalise()", () => {
		it("capitalises the first letter of the word", () => {
			const word = StringUtils.capitalise("hello");

			expect(word).to.be.equal("Hello");
		});

		it("capitalises the first letter of the first word", () => {
			const string = StringUtils.capitalise("hello there sunshine");

			expect(string).to.be.equal("Hello there sunshine");
		});

		it("returns the string if an empty string is the parameter", () => {
			const string = StringUtils.capitalise("");

			expect(string).to.be.equal("");
		});
	});
});