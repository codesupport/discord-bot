import { expect } from "chai";
import getEnvironmentVariable from "../../src/utils/getEnvironmentVariable";

describe("getEnvironmentVariable", () => {
	it("should return variable if it is truthy", () => {
		process.env.FAKE_VAR = "fake value";
		expect(getEnvironmentVariable("FAKE_VAR")).to.equal("fake value");
	});

	it("should throw error if variable is falsy", () => {
		expect(() => getEnvironmentVariable("FAKE_VAR")).to.throw('The environment variable "FAKE_VAR" is not set.');
	});

	afterEach(() => {
		delete process.env.FAKE_VAR;
	});
});