import CodeSupportUser from "./CodeSupportUser";

interface CodeSupportArticleRevision {
	articleId: number;
	content: string;
	createdBy: CodeSupportUser;
	createdOn: number;
	description: string;
	id: number;
}

export default CodeSupportArticleRevision;