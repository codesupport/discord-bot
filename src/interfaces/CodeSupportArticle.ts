import { CodeSupportUser } from "./CodeSupportUser";

export interface CodeSupportArticleRevision {
	articleId: number;
	content: string;
	createdBy: CodeSupportUser;
	createdOn: number;
	description: string;
	id: number;
}

export interface CodeSupportArticle {
	createdBy: CodeSupportUser;
	createdOn: number;
	id: number;
	revision: CodeSupportArticleRevision;
	title: string;
	titleId: string;
	updatedBy: CodeSupportUser;
	updatedOn: number;
}