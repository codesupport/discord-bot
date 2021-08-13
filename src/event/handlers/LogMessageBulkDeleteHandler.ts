import { Collection, Constants, Message, Snowflake } from "discord.js";
import LogMessageDeleteHandler from "../../abstracts/LogMessageDeleteHandler";

class LogMessageBulkDeleteHandler extends LogMessageDeleteHandler {
	constructor() {
		super(Constants.Events.MESSAGE_BULK_DELETE);
	}

	async handle(messages: Collection<Snowflake, Message>): Promise<void> {
		await Promise.all(messages.map(super.sendLog));
	}
}

export default LogMessageBulkDeleteHandler;
