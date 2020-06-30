function getEnvironmentVariable(name: string): string {
	const value = process.env[name];

	if (value) return value;

	throw new Error(`The environment variable "${name}" is not set.`);
}

export default getEnvironmentVariable;