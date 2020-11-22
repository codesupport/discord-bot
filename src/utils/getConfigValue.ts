import config from "../config.json";

export function getKeyValue<T>(key: string, obj: Record<string, any>): T {
	if (key.includes(".")) {
		const newKey = key.split(".");
		const [newObj] = newKey;

		delete newKey[0];

		return getKeyValue(newKey.join(""), obj[newObj]);
	}

	return obj[key];
}

function getConfigValue<T>(key: string): T {
	return getKeyValue<T>(key, config);
}

export default getConfigValue;