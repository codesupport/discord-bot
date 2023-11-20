import { Events, Message } from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import getConfigValue from "../../utils/getConfigValue";

class ShowcaseDiscussionThreadHandler extends EventHandler {
	constructor() {
		super(Events.MessageCreate);
	}

	async handle(message: Message): Promise<void> {
		if (message.channelId !== getConfigValue("SHOWCASE_CHANNEL_ID")) return;

		const username = message.member?.nickname ?? message.member?.user.username;

		try {
			await message.startThread({
				name: `Discuss ${username}'s Showcase Post`
			});
		} catch (error) {
			console.error("Failed to create thread for showcase post", {
				error
			});
		}
	}
}

export default ShowcaseDiscussionThreadHandler;
