import { expect } from "chai";

import app from "../src/app";

describe("app", () => {
	beforeEach(() => {
		process.env.DISCORD_TOKEN = "FAKE_TOKEN";
	});

	it("should throw error if DISCORD_TOKEN is not set", () => {
		process.env.DISCORD_TOKEN = undefined;

		expect(app).to.throw("You must supply the DISCORD_TOKEN environment variable.");
	});
});