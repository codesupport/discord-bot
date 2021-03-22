export interface CodeSupportRole {
	code: string;
	id: number;
	label: string;
}

export interface CodeSupportUser {
	alias: string;
	avatarLink: string;
	disabled: boolean;
	discordId: string;
	discordUsername: string;
	id: number;
	joinDate: number;
	role: CodeSupportRole;
}
