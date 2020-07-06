class DateUtils {
	static getDaysBetweenDates(date1: Date, date2: Date): number {
		const diff = date1.getTime() - date2.getTime();

		return Math.floor(diff / (1000 * 3600 * 24));
	}

	static formatDaysAgo(days: number): string {
		if (days === 0) return "Today";
		if (days === 1) return "Yesterday";
		return `${days} day(s) ago`;
	}
}

export default DateUtils;