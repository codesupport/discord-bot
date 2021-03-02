import EventHandler from "../../abstracts/EventHandler";
import { Message, Constants } from "discord.js";
import MessagePreviewService from "../../services/MessagePreviewService";

class DiscordMessageLinkHandler extends EventHandler {
	constructor() {
		super(Constants.Events.MESSAGE_CREATE);
	}

	async handle(message: Message): Promise<void> {
		const messageRegex = /https:\/\/(?:ptb\.)?discord(?:app)?\.com\/channels\/\d+\/\d+\/\d+/gm;
		const matches = message.content.matchAll(messageRegex);

		for (const match of matches) {
			const index = match.index;

			if (index !== undefined) {
				let link = match[0];

				if (message.content.charAt(index - 1) !== "<" || message.content.charAt(index + link.length) !== ">") {
					link = link.replace(/app/, "").replace(/ptb\./, "");
					const messagePreviewService = MessagePreviewService.getInstance();

					await messagePreviewService.generatePreview(link, message);
				}
			}
		}
	}
}

export default DiscordMessageLinkHandler;