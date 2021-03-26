import CodeSupportUser from "./CodeSupportUser";
import CodeSupportArticleRevision from "./CodeSupportArticleRevision";

interface CodeSupportArticle {
	createdBy: CodeSupportUser;
	createdOn: number;
	id: number;
	revision: CodeSupportArticleRevision;
	title: string;
	titleId: string;
	updatedBy: CodeSupportUser;
	updatedOn: number;
}

export default CodeSupportArticle;