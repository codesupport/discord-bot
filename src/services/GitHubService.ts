import axios from "axios";
import { injectable as Injectable } from "tsyringe";
import GitHubRepository from "../interfaces/GitHubRepository";
import GitHubPullRequest from "../interfaces/GitHubPullRequest";
import GitHubIssue from "../interfaces/GitHubIssue";

@Injectable()
class GitHubService {
	async getRepository(user: string, repo: string): Promise<GitHubRepository> {
		const url = `https://api.github.com/repos/${user}/${repo}`;
		const { status, data } = await axios.get(url);

		// GitHub API has the key subscribers_count as stars and the key stars as watchers
		if (status === 200) {
			return {
				user: data.owner.login,
				repo: data.name,
				description: data.description,
				language: data.language,
				url: data.html_url,
				issues_and_pullrequests_count: data.open_issues_count,
				forks: data.forks,
				watchers: data.subscribers_count,
				stars: data.watchers
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

	async getIssues(user: string, repo: string): Promise<GitHubIssue[]> {
		const url = `https://api.github.com/repos/${user}/${repo}/issues`;

		const { data } = await axios.get(url);

		if (data.length !== 0) {
			const issues = data.filter((issueAndPr: any) => !issueAndPr.pull_request)
				.map((issue: any) => ({
					title: issue.title,
					number: issue.number,
					author: issue.user.login,
					author_url: issue.user.html_url,
					issue_url: issue.html_url,
					created_at: new Date(issue.created_at)
				}));

			return issues;
		}

		return [];
	}
}

export default GitHubService;
