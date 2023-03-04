class NumberUtils {
	static getRandomNumberInRange(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	static hexadecimalToInteger(hex: string): number {
		return parseInt(hex.replace("#", ""), 16);
	}
}

export default NumberUtils;