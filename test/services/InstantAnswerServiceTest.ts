import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import axios from "axios";

import InstantAnswerService from "../../src/services/InstantAnswerService";

describe("InstantAnswerService", () => {
	describe("::getInstance()", () => {
		it("returns an instance of InstantAnswerService", () => {
			const service = new InstantAnswerService();

			expect(service).to.be.instanceOf(InstantAnswerService);
		});
	});

	describe("query", () => {
		let sandbox: SinonSandbox;
		let instantAnswer: InstantAnswerService;

		beforeEach(() => {
			sandbox = createSandbox();
			instantAnswer = new InstantAnswerService();
		});

		it("makes a GET request to the DuckDuckGo API", async () => {
			const axiosGet = sandbox.stub(axios, "get").resolves({
				status: 200,
				data: {
					Heading: "This is a heading",
					AbstractText: "This is a description."
				}
			});

			await instantAnswer.query("test");

			expect(axiosGet.called).to.be.true;
		});

		it("throws an error if the API does not return a success", async () => {
			const axiosGet = sandbox.stub(axios, "get").resolves({
				status: 500,
				data: {}
			});

			// Chai can't detect throws inside async functions. This is a hack to get it working.
			try {
				await instantAnswer.query("test");
			} catch ({ message }) {
				expect(message).to.equal("There was a problem with the DuckDuckGo API.");
			}

			expect(axiosGet.called).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
