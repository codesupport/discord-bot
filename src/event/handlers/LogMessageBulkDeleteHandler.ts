import { Collection, Events, Message, Snowflake } from "discord.js";
import LogMessageDeleteHandler from "../../abstracts/LogMessageDeleteHandler";

class LogMessageBulkDeleteHandler extends LogMessageDeleteHandler {
	constructor() {
		super(Events.MessageBulkDelete);
	}

	async handle(messages: Collection<Snowflake, Message>): Promise<void> {
		await Promise.all(messages.map(super.sendLog));
	}
}

export default LogMessageBulkDeleteHandler;
