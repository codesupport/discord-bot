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

export class MockWhitelistedCommand extends Command {
	constructor() {
		super("whitelist", "Mock Whitelist Command", {
			whitelistedChannels: ["1234"]
		});
	}

	async run(message: Message, args: string[]): Promise<void> {
		return;
	}
}