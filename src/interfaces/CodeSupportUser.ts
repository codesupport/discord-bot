export default interface CodeSupportRole {
	code: string;
	id: number;
	label: string;
	// eslint-disable-next-line
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
	// eslint-disable-next-line
}