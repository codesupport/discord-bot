export interface AOCCompletionDayLevel {
	get_star_ts: string;
}

export interface AOCMember {
	global_score: number;
	local_score: number;
	completion_day_level: { [key: string]: { [key: string]: AOCCompletionDayLevel } };
	stars: number;
	last_star_ts: number | string;
	id: string;
	name: null | string;
}

export interface AOCLeaderBoard {
	event: string;
	owner_id: string;
	members: { [key: string]: AOCMember };
}

