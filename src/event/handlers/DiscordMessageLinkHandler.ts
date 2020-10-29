import EventHandler from "../../abstracts/EventHandler";
import { Message, Constants } from "discord.js";
import MessagePreviewService from "../../services/MessagePreviewService";

class DiscordMessageLinkHandler extends EventHandler {
	constructor() {
		super(Constants.Events.MESSAGE_CREATE);
	}

	async handle(message: Message): Promise<void> {
		const messagePreviewService = MessagePreviewService.getInstance();
		const messageRegex = /https:\/\/(ptb\.)?discord(app)?\.com\/channels\//gm;

		if (message.content.match(messageRegex)) {
			const linkIndex = message.content.search(messageRegex);

			// Gets the position of the url from a string
			const wordIndex = message.content.slice(0, linkIndex).split(" ").length - 1;
			const linkContent = message.content.split(" ")[wordIndex];

			if (linkContent.startsWith("<") && linkContent.endsWith(">")) return;

			const link = message.content.replace(/app/, "").replace(/ptb\./, "").substring(linkIndex, linkIndex + 85);

			await messagePreviewService.generatePreview(link, message);
		}
	}
}

export default DiscordMessageLinkHandler;