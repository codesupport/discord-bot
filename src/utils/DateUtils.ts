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

	static getFormattedTimeSinceEpoch(timeInMs: number): string {
		let difference = Date.now() - timeInMs;

		let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);

		difference -= daysDifference * 1000 * 60 * 60 * 24;

		const hoursDifference = Math.floor(difference / 1000 / 60 / 60);

		difference -= hoursDifference * 1000 * 60 * 60;

		const minutesDifference = Math.floor(difference / 1000 / 60);

		difference -= minutesDifference * 1000 * 60;

		const secondDifference = Math.floor(difference / 1000);

		const yearsDifference = Math.floor(daysDifference / 365.2422);

		daysDifference -= yearsDifference * 365.2422;

		let formattedString = "";

		if (yearsDifference > 0) formattedString += `${yearsDifference} years, `;
		if (daysDifference > 0) formattedString += `${daysDifference} days, `;
		if (hoursDifference > 0) formattedString += `${hoursDifference} hours, `;
		if (minutesDifference > 0) formattedString += `${minutesDifference} minutes and `;

		formattedString += `${secondDifference} seconds`;

		return formattedString;
	}
}

export default DateUtils;