import InheritedConfig from "@codesupport/inherited-config";

const config = new InheritedConfig({
	path: "src"
});

function getConfigValue<T>(key: string): T {
	const value = config.getValue<T>(key);

	if (!value) throw new Error(`Config for '${key}' is not found.`);

	return value;
}

export default getConfigValue;