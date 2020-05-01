abstract class Command {
	private readonly name: string;
	private readonly description: string;

	protected constructor(name: string, description: string) {
		this.name = name;
		this.description = description;
	}

	getName() {
		return this.name;
	}

	getDescription() {
		return this.description;
	}
}

export default Command;