import axios from "axios";
import GitHubRepository from "../interfaces/GitHubRepository";
import GitHubPullRequest from "../interfaces/GitHubPullRequest";

class GitHubService {
	private static instance: GitHubService;

	/* eslint-disable */
	private constructor() { }
	/* eslint-enable */

	static getInstance(): GitHubService {
		if (!this.instance) {
			this.instance = new GitHubService();
		}

		return this.instance;
	}

	async getRepository(user: string, repo: string): Promise<GitHubRepository> {
		const url = `https://api.github.com/repos/${user}/${repo}`;
		const { status, data } = await axios.get(url);

		if (status === 200) {
			return {
				user: data.owner.login,
				repo: data.name,
				description: data.description,
				language: data.language,
				url: data.html_url,
				issues_and_pullrequests_count: data.open_issues_count
			};
		} else {
			throw new Error("There was a problem with the request to GitHub.");
		}
	}

	async getPullRequest(user: string, repo: string): Promise<GitHubPullRequest[]> {
		const url = `https://api.github.com/repos/${user}/${repo}/pulls`;
		const { data } = await axios.get(url);

		if (data.length !== 0) {
			const pullRequests = data.map((pull: any) => ({
				title: pull.title,
				description: pull.body,
				author: pull.user.login
			}));

			return pullRequests;
		}

		return [];
	}
}

export default GitHubService;