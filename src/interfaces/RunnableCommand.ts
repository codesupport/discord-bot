import { Message } from "discord.js";

interface RunnableCommand {
	run(message: Message, args?: string[]): Promise<void>;
}

export default RunnableCommand;