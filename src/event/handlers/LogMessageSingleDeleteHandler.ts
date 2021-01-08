import { Constants, Message } from "discord.js";
import LogMessageDeleteHandler from "../../abstracts/LogMessageDeleteHandler";

class LogMessageSingleDeleteHandler extends LogMessageDeleteHandler {
	constructor() {
		super(Constants.Events.MESSAGE_DELETE);
	}

	async handle(message: Message): Promise<void> {
		await super.sendLog(message);
	}
}

export default LogMessageSingleDeleteHandler;