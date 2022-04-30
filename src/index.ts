import App from "./app";

async function app() {
	try {
		await new App().init();
	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error(error.message, { error });
		} else {
			console.error(error);
		}
	}
}

app();