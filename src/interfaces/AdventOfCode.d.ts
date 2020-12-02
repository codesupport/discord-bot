interface AocLeaderBoard {
	event: string;
	owner_id: string;
	members: { [key: string]: AocMember };
}

interface AocMember {
	global_score: number;
	local_score: number;
	completion_day_level: { [key: string]: { [key: string]: AocCompletionDayLevel } };
	stars: number;
	last_star_ts: number | string;
	id: string;
	name: null | string;
}

interface AocCompletionDayLevel {
	get_star_ts: string;
}
