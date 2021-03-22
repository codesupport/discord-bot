import axios from "axios";
import {CodeSupportArticle} from "../interfaces/CodeSupportArticle";
import {CodeSupportUser} from "../interfaces/CodeSupportUser";

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
			data.response.sort((a: CodeSupportArticle, b: CodeSupportArticle) => b.createdOn - a.createdOn);
			return data.response.slice(0, amount);
		}

		return [];
	}

	public buildArticleURL(article: CodeSupportArticle): string {
		return `https://codesupport.dev/article/${article.titleId}`;
	}

	public buildProfileURL(user: CodeSupportUser): string {
		return `https://codesupport.dev/profile/${user.alias.toLowerCase()}`;
	}
}

export default ArticleService;