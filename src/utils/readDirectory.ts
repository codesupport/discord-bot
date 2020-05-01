import { readdir } from "fs";
import { promisify } from "util";

export const readDirectory = promisify(readdir);