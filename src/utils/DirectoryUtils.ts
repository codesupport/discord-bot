import { readdir } from "fs";
import { promisify } from "util";

class DirectoryUtils {
    static readDirectory = promisify(readdir);

    static async getFilesInDirectory(directory: string, ending: string): Promise<any[]> {
	    const directoryContents = await this.readDirectory(directory);

	    /* eslint-disable */
        return directoryContents
            .filter(file => file.endsWith(ending))
            .map(file => require(`${directory}/${file}`));
        /* eslint-enable */
    }
}

export default DirectoryUtils;