interface GitHubRepository {
	user: string;
	repo: string;
	description: string;
	language: string;
	url: string;
	issues_count: number;
}

export default GitHubRepository;