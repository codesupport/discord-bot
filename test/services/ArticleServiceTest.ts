import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import axios from "axios";

import ArticleService from "../../src/services/ArticleService";

describe("ArticleService", () => {
	describe("::getInstance()", () => {
		it("returns an instance of ArticleService", () => {
			const service = ArticleService.getInstance();

			expect(service).to.be.instanceOf(ArticleService);
		});
	});

	describe("getLatest()", () => {
		let sandbox: SinonSandbox;
		let article: ArticleService;

		beforeEach(() => {
			sandbox = createSandbox();
			article = ArticleService.getInstance();
		});

		it("performs a GET request to the CodeSupport Api", async () => {
			const axiosGet = sandbox.stub(axios, "get").resolves({
				status: "OK",
				response: [{
					title: "This is a title",
					description: "This is a description",
					author: "Author name",
					author_url: "Url",
					article_url: "Url"
				}]
			});

			const result = await article.getLatest();

			expect(axiosGet.called).to.be.true;
			expect(result).to.have.length(1);
		});

		it("returns an empty array if there are no articles", async () => {
			const axiosGet = sandbox.stub(axios, "get").resolves({
				status: "OK",
				data: []
			});

			const result = await article.getLatest();

			expect(axiosGet.called).to.be.true;
			expect(result).to.have.length(0);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});