import { readDirectory } from "./readDirectory";

async function getFilesInDirectory(directory: string, ending: string): Promise<any[]> {
	const directoryContents = await readDirectory(directory);
	return directoryContents
		.filter(file => file.endsWith(ending))
		.map(file => require(`${directory}/${file}`));
}

export default getFilesInDirectory;