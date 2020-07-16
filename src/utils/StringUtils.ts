class StringUtils {
	static capitalise(string: string): string {
		return string.length ? string[0].toUpperCase() + string.slice(1) : string;
	}
}

export default StringUtils;