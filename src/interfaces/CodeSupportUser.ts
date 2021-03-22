/*eslint-disable */
export default interface CodeSupportRole {
	code: string;
	id: number;
	label: string;
}

export default interface CodeSupportUser {
	alias: string;
	avatarLink: string;
	disabled: boolean;
	discordId: string;
	discordUsername: string;
	id: number;
	joinDate: number;
	role: CodeSupportRole;
}
/* eslint-enable */