import {ApplicationCommandData, CommandInteraction} from "discord.js";

abstract class Command {
	private readonly slashCommandData: ApplicationCommandData

	protected constructor(slashCommandData: ApplicationCommandData) {
		this.slashCommandData = slashCommandData;
	}

	abstract run(interaction: CommandInteraction): Promise<void>;

	getName(): string {
		return this.slashCommandData.name;
	}

	getSlashCommandData(): ApplicationCommandData {
		return this.slashCommandData;
	}
}

export default Command;