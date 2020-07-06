import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import DateUtils from "../../src/utils/DateUtils";

describe("DateUtils", () => {
	describe("getDaysBetweenDates()", () => {
		it("returns 0 if it's on the same date", () => {
			const days = DateUtils.getDaysBetweenDates(new Date("2020-01-01"), new Date("2020-01-01"));

			expect(days).to.be.equal(0);
		});

		it("returns 1 if it's a day later", () => {
			const days = DateUtils.getDaysBetweenDates(new Date("2020-01-02"), new Date("2020-01-01"));

			expect(days).to.be.equal(1);
		});
	});

	describe("getDaysBetweenDates()", () => {
		it("throws an error on a negative number", () => {
			try {
				DateUtils.formatDaysAgo(-1);
			} catch ({ message }) {
				expect(message).to.be.equal("Number has to be positive");
			}
		});

		it("returns Today if parameter is 0", () => {
			const text = DateUtils.formatDaysAgo(0);

			expect(text).to.be.equal("Today");
		});

		it("returns Yesterday if parameter is 1", () => {
			const text = DateUtils.formatDaysAgo(1);

			expect(text).to.be.equal("Yesterday");
		});

		it("returns 3 day(s) ago if paramater is 3", () => {
			const text = DateUtils.formatDaysAgo(3);

			expect(text).to.be.equal("3 day(s) ago");
		});
	});
});