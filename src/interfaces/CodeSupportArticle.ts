import CodeSupportUser from "./CodeSupportUser";

export default interface CodeSupportArticleRevision {
	articleId: number;
	content: string;
	createdBy: CodeSupportUser;
	createdOn: number;
	description: string;
	id: number;
	// eslint-disable-next-line
}

export default interface CodeSupportArticle {
	createdBy: CodeSupportUser;
	createdOn: number;
	id: number;
	revision: CodeSupportArticleRevision;
	title: string;
	titleId: string;
	updatedBy: CodeSupportUser;
	updatedOn: number;
	// eslint-disable-next-line
}