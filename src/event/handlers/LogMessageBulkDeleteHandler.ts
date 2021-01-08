import { Collection, Constants, Message, Snowflake } from "discord.js";
import LogMessageDeleteHandler from "../../abstracts/LogMessageDeleteHandler";

class LogMessageBulkDeleteHandler extends LogMessageDeleteHandler {
	constructor() {
		super(Constants.Events.MESSAGE_BULK_DELETE);
	}

	async handle(messages: Collection<Snowflake, Message>): Promise<void> {
		for (const message of messages.array()) {
			await super.sendLog(message);
		}
	}
}

export default LogMessageBulkDeleteHandler;