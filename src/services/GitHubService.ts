import axios from "axios";
import GitHubRepository from "../interfaces/GitHubRepository";

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
				issues_count: data.open_issues_count
			};
		} else {
			throw new Error("There was a problem with the request to GitHub.");
		}
	}
}

export default GitHubService;