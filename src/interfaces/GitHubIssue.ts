interface GitHubIssue {
	title: string;
	number: number;
	author: string;
	author_url: string;
	issue_url: string;
	created_at: Date;
}

export default GitHubIssue;