import { Message } from "discord.js";
import CommandOptions from "../interfaces/CommandOptions";

abstract class Command {
	private readonly name: string;
	private readonly description: string;
	private readonly options: CommandOptions | undefined;
	private readonly aliases: Array<string>;

	protected constructor(name: string, description: string, options?: CommandOptions, aliases: Array<string> = []) {
		this.name = name;
		this.description = description;
		this.options = options;
		this.aliases = aliases;
	}

	abstract async run(message: Message, args?: string[]): Promise<void>;

	getName(): string {
		return this.name;
	}

	getDescription(): string {
		return this.description;
	}

	getAliases(): Array<string> {
		return this.aliases;
	}

	isSelfDestructing(): boolean {
		return this.options?.selfDestructing || false;
	}
}

export default Command;