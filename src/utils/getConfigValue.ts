import config from "../config.json";

function getKeyValue(key: string, obj: Record<string, any>) {
	return obj[key];
}

function getConfigValue(key: string) {
	return getKeyValue(key, config);
}

export default getConfigValue;