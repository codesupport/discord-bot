import CodeSupportUser from "./CodeSupportUser";
/*eslint-disable */
export default interface CodeSupportArticleRevision {
	articleId: number;
	content: string;
	createdBy: CodeSupportUser;
	createdOn: number;
	description: string;
	id: number;
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
}
/* eslint-enable */