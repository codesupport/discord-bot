import axios from "axios";
import CodeSupportArticle from "../interfaces/CodeSupportArticle";

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

	public async getLatest(amount: number): Promise<CodeSupportArticle[]> {
		const url = "https://api.codesupport.dev/article/v1/articles?publishedonly=true";

		const { data } = await axios.get(url);

		if (data.length !== 0) {
			return data.response
				.sort((a: CodeSupportArticle, b: CodeSupportArticle) => b.createdOn - a.createdOn)
				.slice(0, amount);
		}

		return [];
	}

	public buildArticleURL(title: string): string {
		return `https://codesupport.dev/article/${title}`;
	}
}

export default ArticleService;