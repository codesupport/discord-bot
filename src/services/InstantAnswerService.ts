import axios from "axios";
import { injectable as Injectable } from "tsyringe";
import InstantAnswer from "../interfaces/InstantAnswer";
import getConfigValue from "../utils/getConfigValue";

@Injectable()
class InstantAnswerService {
	async query(query: string): Promise<InstantAnswer | null> {
		const url = `https://api.duckduckgo.com/?q=${query}&format=json&t=codesupport-discord-bot`;
		const { status, data } = await axios.get(url);

		if (status === 200) {
			if (data.Heading !== "") {
				const [language] = getConfigValue<string[]>("INSTANT_ANSWER_HIGHLIGHTS").map(highlight =>
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
			}

			return null;
		} else {
			throw new Error("There was a problem with the DuckDuckGo API.");
		}
	}
}

export default InstantAnswerService;
