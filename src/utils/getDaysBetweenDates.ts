function getDaysBetweenDates(date1: Date, date2: Date): number {
	const diff = date1.getTime() - date2.getTime();

	return Math.ceil(diff / (1000 * 3600 * 24));
}

export default getDaysBetweenDates;