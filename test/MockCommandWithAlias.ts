import Command from "../src/abstracts/Command";
import { Message } from "discord.js";

export default class MockCommandWithAlias extends Command {
	constructor() {
		super(
			"mock-alias",
			"Mock Command with Aliases",
			{
				aliases: ["mocky", "mocko"]
			}
		);
	}

	async run(message: Message, args: string[]): Promise<void> {

	}
}