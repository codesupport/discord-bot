import { expect } from "chai";
import DateUtils from "../../src/utils/DateUtils";

describe("DateUtils", () => {
	describe("::getDaysBetweenDates()", () => {
		it("returns 0 if it's on the same date", () => {
			const days = DateUtils.getDaysBetweenDates(new Date("2020-01-01"), new Date("2020-01-01"));

			expect(days).to.be.equal(0);
		});

		it("returns 1 if it's a day later", () => {
			const days = DateUtils.getDaysBetweenDates(new Date("2020-01-02"), new Date("2020-01-01"));

			expect(days).to.be.equal(1);
		});
	});

	describe("::formatDaysAgo()", () => {
		it("throws an error on a negative number", () => {
			try {
				DateUtils.formatDaysAgo(-1);
			} catch ({ message }) {
				expect(message).to.be.equal("Number has to be positive");
			}
		});

		it("returns Today if parameter is 0", () => {
			const text = DateUtils.formatDaysAgo(0);

			expect(text).to.be.equal("today");
		});

		it("returns Yesterday if parameter is 1", () => {
			const text = DateUtils.formatDaysAgo(1);

			expect(text).to.be.equal("yesterday");
		});

		it("returns 3 days ago if paramater is 3", () => {
			const text = DateUtils.formatDaysAgo(3);

			expect(text).to.be.equal("3 days ago");
		});
	});

	describe("::formatAsText()", () => {
		it("returns a formatted date", () => {
			const date = new Date();

			date.setHours(12);
			date.setMinutes(30);
			date.setDate(26);
			date.setMonth(0);
			date.setFullYear(2007);

			expect(DateUtils.formatAsText(date)).to.equal("12:30 on 26 Jan 2007");
		});

		it("formats numbers smaller than 10 correctly", () => {
			const date = new Date();

			date.setHours(9);
			date.setMinutes(5);
			date.setDate(7);
			date.setMonth(1);
			date.setFullYear(2010);

			expect(DateUtils.formatAsText(date)).to.equal("09:05 on 7 Feb 2010");
		});
	});
});