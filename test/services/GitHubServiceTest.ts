import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import axios from "axios";

import GitHubService from "../../src/services/GitHubService";

describe("GitHubService", () => {
	describe("::getInstance()", () => {
		it("returns an instance of GitHubService", () => {
			const service = new GitHubService();

			expect(service).to.be.instanceOf(GitHubService);
		});
	});

	describe("getRepository()", () => {
		let sandbox: SinonSandbox;
		let gitHub: GitHubService;

		beforeEach(() => {
			sandbox = createSandbox();
			gitHub = new GitHubService();
		});

		it("performs a GET request to the GitHub API", async () => {
			const axiosGet = sandbox.stub(axios, "get").resolves({
				status: 200,
				data: {
					owner: {
						login: "user"
					},
					name: "repo-github",
					description: "The repo description",
					language: "TypeScript",
					html_url: "https://github.com/codesupport/discord-bot",
					open_issues_count: 1,
					forks: 5,
					subscribers_count: 3,
					watchers: 10
				}
			});

			await gitHub.getRepository("user", "repo");

			expect(axiosGet.called).to.be.true;
		});

		it("throws an error if the API responds with Not Found", async () => {
			const axiosGet = sandbox.stub(axios, "get").resolves({
				status: 404,
				data: {}
			});

			// Chai can't detect throws inside async functions. This is a hack to get it working.
			try {
				await gitHub.getRepository("user", "repo");
			} catch ({ message }) {
				expect(message).to.equal("There was a problem with the request to GitHub.");
			}

			expect(axiosGet.called).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe("getPullRequest()", () => {
		let sandbox: SinonSandbox;
		let gitHub: GitHubService;

		beforeEach(() => {
			sandbox = createSandbox();
			gitHub = new GitHubService();
		});

		it("performs a GET request to the GitHub pulls API", async () => {
			const axiosGet = sandbox.stub(axios, "get").resolves({
				status: 200,
				data: [{
					title: "This is a title",
					body: "This is a description",
					user: {
						login: "user"
					}
				}]
			});

			const result = await gitHub.getPullRequest("user", "repo");

			expect(axiosGet.called).to.be.true;
			expect(result).to.have.length(1);
		});

		it("returns an empty array if there is no data present", async () => {
			const axiosGet = sandbox.stub(axios, "get").resolves({
				status: 200,
				data: []
			});

			const result = await gitHub.getPullRequest("user", "repo");

			expect(axiosGet.called).to.be.true;
			expect(result).to.have.length(0);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe("getIssues()", () => {
		let sandbox: SinonSandbox;
		let gitHub: GitHubService;

		beforeEach(() => {
			sandbox = createSandbox();
			gitHub = new GitHubService();
		});

		it("performs a GET request to the GitHub issues API", async () => {
			const axiosGet = sandbox.stub(axios, "get").resolves({
				status: 200,
				data: [{
					title: "This is a title",
					number: 69,
					user: {
						login: "user",
						html_url: "https://github.com/user/"
					},
					html_url: "https://github.com/codesupport/discord-bot",
					created_at: "2020-01-01T12:00:00Z"
				}]
			});

			const result = await gitHub.getIssues("user", "repo");

			expect(axiosGet.called).to.be.true;
			expect(result).to.have.length(1);
		});

		it("returns an empty array if there are no issues", async () => {
			const axiosGet = sandbox.stub(axios, "get").resolves({
				status: 200,
				data: []
			});

			const result = await gitHub.getIssues("user", "repo");

			expect(axiosGet.called).to.be.true;
			expect(result).to.have.length(0);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
