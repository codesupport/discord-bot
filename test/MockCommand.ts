import Command from "../src/abstracts/Command";
import { Message } from "discord.js";

export default class MockCommand extends Command {
	constructor() {
		super("mock", "Mock Command");
	}

	async run(message: Message, args: string[]): Promise<void> {
		return;
	}
}