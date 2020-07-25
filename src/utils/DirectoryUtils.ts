import { readdir } from "fs";
import { promisify } from "util";

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
}

export default DirectoryUtils;
