import axios from "axios";
import { INSTANT_ANSWER_HIGHLIGHTS } from "../config.json";
import InstantAnswer from "../interfaces/InstantAnswer";

class InstantAnswerService {
	private static instance: InstantAnswerService;

	/* eslint-disable */
	private constructor() {}
	/* eslint-enable */

	static getInstance(): InstantAnswerService {
		if (!this.instance) {
			this.instance = new InstantAnswerService();
		}

		return this.instance;
	}

	async query(query: string): Promise<InstantAnswer> {
		const url = `https://api.duckduckgo.com/?q=${query}&format=json&t=codesupport-discord-bot`;
		const { status, data } = await axios.get(url);

		if (status === 200 && data.Heading !== "") {
			const [language] = INSTANT_ANSWER_HIGHLIGHTS.map(highlight =>
				data.Heading.toLowerCase().includes(highlight) && highlight
			);

			const description = data.AbstractText
				.replace(/<code>/g, `\`\`\`${language}\n`)
				.replace(/<\/code>/g, "```")
				.replace(/<\/?[^>]+(>|$)/g, "")
				.replace(/&#x27;/g, "\"")
				.replace(/&lt;/g, "<")
				.replace(/&gt;/g, ">");

			return {
				heading: data.Heading,
				description,
				url: data.AbstractURL
			};
		} else {
			throw new Error("There was a problem with the DuckDuckGo API.");
		}
	}
}

export default InstantAnswerService;