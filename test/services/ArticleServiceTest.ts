import {createSandbox, SinonSandbox} from "sinon";
import {expect} from "chai";
import axios from "axios";

import ArticleService from "../../src/services/ArticleService";
import {CodeSupportArticle} from "../../src/interfaces/CodeSupportArticle";

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
				status: 200,
				data: {
					status: "OK",
					response: [{
						titleId: "this-is-a-title",
						title: "This is a title",
						revision: {
							description: "This is a description"
						},
						createdBy: {
							alias: "Author name"
						}
					}]
				}
			});

			const result = await article.getLatest(5);

			expect(axiosGet.called).to.be.true;
			expect(result).to.have.length(1);
		});

		it("Returns given amount of articles", async () => {
			const axiosGet = sandbox.stub(axios, "get").resolves({
				status: 200,
				data: {
					status: "OK",
					response: [{
						titleId: "this-is-a-title",
						title: "This is a title",
						revision: {
							description: "This is a description"
						},
						createdBy: {
							alias: "Author name"
						}
					},

					{
						titleId: "this-is-a-title",
						title: "This is a title",
						revision: {
							description: "This is a description"
						},
						createdBy: {
							alias: "Author name"
						}
					},

					{
						titleId: "this-is-a-title",
						title: "This is a title",
						revision: {
							description: "This is a description"
						},
						createdBy: {
							alias: "Author name"
						}
					}

					]
				}
			});

			const result = await article.getLatest(2);

			expect(axiosGet.called).to.be.true;
			expect(result).to.have.length(2);
		});

		it("returns an empty array if there are no articles", async () => {
			const axiosGet = sandbox.stub(axios, "get").resolves({
				status: "OK",
				data: {
					response: []
				}
			});

			const result = await article.getLatest(5);

			expect(axiosGet.called).to.be.true;
			expect(result).to.have.length(0);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe("buildProfileURL()", () => {
		let sandbox: SinonSandbox;
		let article: ArticleService;

		beforeEach(() => {
			sandbox = createSandbox();
			article = ArticleService.getInstance();
		});

		it("Generates url containing alias", async () => {
			const result = await article.buildProfileURL(article.createdBy);

			expect(result).to.have.length(1);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});