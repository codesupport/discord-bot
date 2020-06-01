import { Message } from "discord.js";
import CommandOptions from "../interfaces/CommandOptions";

abstract class Command {
	private readonly name: string;
	private readonly description: string;
	private readonly options: CommandOptions | undefined;

	protected constructor(name: string, description: string, options?: CommandOptions) {
		this.name = name;
		this.description = description;
		this.options = options;
	}

	abstract async run(message: Message, args?: string[]): Promise<void>;

	getName(): string {
		return this.name;
	}

	getDescription(): string {
		return this.description;
	}

	getAliases(): string[] {
		return this.options?.aliases || [];
	}

	isSelfDestructing(): boolean {
		return this.options?.selfDestructing || false;
	}
}

export default Command;