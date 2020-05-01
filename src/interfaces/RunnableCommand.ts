import { Message } from "discord.js";

interface RunnableCommand {
	run(message: Message): Promise<void>;
}

export default RunnableCommand;