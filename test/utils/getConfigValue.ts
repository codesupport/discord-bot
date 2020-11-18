import { expect } from "chai";
import { getKeyValue } from "../../src/utils/getConfigValue";

describe("getConfigValue()", () => {
	describe("getKeyValue", () => {
		it("returns the requested key's value", () => {
			const data = {
				test: 1
			};

			expect(getKeyValue<number>("test", data)).to.equal(data.test);
		});

		it("returns the requested key's value if not top level", () => {
			const data = {
				more_data: {
					test: 1
				}
			};

			expect(getKeyValue<number>("more_data.test", data)).to.equal(data.more_data.test);
		});
	});
});