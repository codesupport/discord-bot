class DateUtils {
	static getDaysBetweenDates(date1: Date, date2: Date): number {
		const diff = date1.getTime() - date2.getTime();

		return Math.floor(diff / (1000 * 3600 * 24));
	}

	static formatDaysAgo(days: number): string {
		if (days < 0) throw new Error("Number has to be positive");
		if (days === 0) return "today";
		if (days === 1) return "yesterday";
		return `${days} days ago`;
	}

	static formatAsText(date: Date): string {
		const time = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const month = months[date.getMonth()];

		return `${time} on ${date.getDate()} ${month} ${date.getFullYear()}`;
	}
}

export default DateUtils;