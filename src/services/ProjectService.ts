import projectsList from "../src-assets/projects.json";
import Project from "../interfaces/Project";

class ProjectService {
	private static instance: ProjectService;

	/* eslint-disable */
	private constructor() {
	}

	/* eslint-enable */

	static getInstance(): ProjectService {
		if (!this.instance) {
			this.instance = new ProjectService();
		}

		return this.instance;
	}

	public formatTags(args: string[]): string[] {
		const formattedTags = args.map((arg: string) => arg.replace("#", "").toLowerCase());

		return formattedTags.filter((arg: string) => arg.trim().length > 0);
	}

	public getProjectByTags(tags: string[]): Project | null {
		if (tags.length === 0) return projectsList[~~(projectsList.length * Math.random())];

		const filterProjects = projectsList.filter(project => tags.every(item => project.tags.includes(item)));

		return filterProjects[~~(filterProjects.length * Math.random())];
	}

	public getDifficulty(project: Project) {
		const difficultyLevels = ["easy", "medium", "hard"];

		return difficultyLevels.filter(element => project.tags.includes(element))[0];
	}
}

export default ProjectService;