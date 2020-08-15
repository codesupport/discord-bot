import { expect } from "chai";
import ResourcesCommand from "../../src/commands/ResourcesCommand";

describe("ResourcesCommand", () => {
	describe("constructor()", () => {
		it("creates a command called resources", () => {
			const command = new ResourcesCommand();

			expect(command.getName()).to.equal("resources");
		});

		it("creates a command with correct description", () => {
			const command = new ResourcesCommand();

			expect(command.getDescription()).to.equal("Displays a link to the resources page of CodeSupport's website.");
		});

		it("creates a command with correct aliases", () => {
			const command = new ResourcesCommand();

			expect(command.getAliases().includes("resource")).to.be.true;
		});
	});
});