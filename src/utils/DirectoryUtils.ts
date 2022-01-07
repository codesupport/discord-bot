import { readdir } from "fs";
import { promisify } from "util";
import getConfigValue from "./getConfigValue";

class DirectoryUtils {
	static readDirectory = promisify(readdir);

	private static require = require;

	/* eslint-disable */
	static async getFilesInDirectory(directory: string, ending: string): Promise<any[]> {
		const directoryContents = await this.readDirectory(directory);

		return directoryContents
			.filter(file => file.endsWith(ending))
			.map(file => this.require(`${directory}/${file}`));
	}
	/* eslint-enable */

	static appendFileExtension(fileName: string): string {
		const extension = process.env.NODE_ENV === getConfigValue<string>("DEVELOPMENT_ENV") ? ".ts" : ".js";

		return fileName + extension;
	}
}

export default DirectoryUtils;
