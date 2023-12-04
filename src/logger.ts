import { Logtail } from "@logtail/node";

interface ILogPayload {
	userId?: string;
	channelId?: string;
	messageId?: string;
	roleId?: string;
	error?: Error | unknown;

	[Key: string]: unknown;
}

export class Logger {
	private readonly logger: Logtail | Console;

	constructor() {
		const token = process.env.LOGTAIL_TOKEN;

		if (token) {
			this.logger = new Logtail(token);
		} else {
			this.logger = console;
			this.logger.warn("No LOGTAIL_TOKEN environment variable provided. Using console logger.");
		}
	}

	info(message: string, payload?: ILogPayload) {
		this.logger.info(message, payload);
	}

	warn(message: string, payload?: ILogPayload) {
		this.logger.warn(message, payload);
	}

	error(message: string, payload?: ILogPayload) {
		this.logger.error(message, payload);
	}

	debug(message: string, payload?: ILogPayload) {
		this.logger.debug(message, payload);
	}
}

export const logger = new Logger();
