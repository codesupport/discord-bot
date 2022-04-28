import App from "./app";

async function app() {
	try {
		await new App().init();
	} catch (error) {
		console.error(error);
	}
}

app();