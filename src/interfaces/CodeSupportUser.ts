import CodeSupportRole from "./CodeSupportRole";

interface CodeSupportUser {
	alias: string;
	avatarLink: string;
	disabled: boolean;
	discordId: string;
	discordUsername: string;
	id: number;
	joinDate: number;
	role: CodeSupportRole;
}

export default CodeSupportUser;
