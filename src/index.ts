import App from "./app";
import { logger } from "./logger";

async function app() {
	try {
		await new App().init();
	} catch (error) {
		logger.error(
			error instanceof Error ? error.message : "An error occurred.",
			{ error }
		);
	}
}

app();
