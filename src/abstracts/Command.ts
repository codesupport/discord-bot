import { Message } from "discord.js";

abstract class Command {
	private readonly name: string;
	private readonly description: string;

	protected constructor(name: string, description: string) {
		this.name = name;
		this.description = description;
	}

	abstract async run(message: Message, args?: string[]): Promise<void>;

	getName(): string {
		return this.name;
	}

	getDescription(): string {
		return this.description;
	}
}

export default Command;