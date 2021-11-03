import {ApplicationCommandData, Message} from "discord.js";

abstract class Command {
	private readonly slashCommandData: ApplicationCommandData

	protected constructor(slashCommandData: ApplicationCommandData) {
		this.slashCommandData = slashCommandData;
	}

	abstract run(message: Message, args?: string[]): Promise<void>;

	getName(): string {
		return this.slashCommandData.name;
	}

	getSlashCommandData(): ApplicationCommandData {
		return this.slashCommandData;
	}
}

export default Command;