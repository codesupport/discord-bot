import axios from "axios";
import ArticlePreview from "../interfaces/ArticlePreview";

class ArticleService {
	private static instance: ArticleService;

	/* eslint-disable */
	private constructor() { }
	/* eslint-enable */

	static getInstance(): ArticleService {
		if (!this.instance) {
			this.instance = new ArticleService();
		}

		return this.instance;
	}


	async getLatest(): Promise<ArticlePreview[]> {
		const url = `https://api.codesupport.dev/article/v1/articles?publishedonly=true`;

		const { data } = await axios.get(url);

		if (data.length !== 0) {

			let articleData = data;

			articleData.response.sort((a: any, b: any) => b.createdOn - a.createdOn);

			articleData = articleData.slice(0, 2);

			const articles = articleData.map((article: any) => ({
					title: article.title,
					description: article.revision.description,
					author: article.createdBy.alias,
					author_url: `https://codesupport.dev/profile/${article.createdBy.alias.toLowerCase()}`,
				}));

			return articles;
		}

		return [];
	}
}

export default ArticleService;