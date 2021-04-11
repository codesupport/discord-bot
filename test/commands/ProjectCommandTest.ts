import { expect } from "chai";
import { Message } from "discord.js";
import { createSandbox, SinonSandbox } from "sinon";
import { BaseMocks } from "@lambocreeper/mock-discord.js";
import Command from "../../src/abstracts/Command";
import { EMBED_COLOURS } from "../../src/config.json";
import ProjectCommand from "../../src/commands/ProjectCommand";
import ProjectService from "../../src/services/ProjectService";

describe("ProjectCommand", () => {
	describe("constructor", () => {
		const command = new ProjectCommand();

		it("creates a command called project", () => {
			expect(command.getName()).to.equal("project");
		});

		it("creates a command with correct description", () => {
			expect(command.getDescription()).to.equal("Returns a random project idea based on given parameters.");
		});

		it("creates a command with correct aliases", () => {
			expect(command.getAliases().includes("projects")).to.be.true;
		});
	});

	describe("run()", () => {
		const command: Command = new ProjectCommand();
		let sandbox: SinonSandbox;
		let message: Message;
		let projectService: ProjectService;

		beforeEach(() => {
			sandbox = createSandbox();
			message = BaseMocks.getMessage();
			projectService = ProjectService.getInstance();
		});

		afterEach(() => {
			sandbox.restore();
		});

		it("returns an embed stating that no project was found with the given query", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["#sinontest-stubbing-project-command-4e2xnwj54z"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("Could not find a project result for the given query.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("should return an embed with project information", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(projectService, "getProjectByTags").returns({
				title: "Mock Project",
				description: "Once upon a time",
				tags: ["easy", "vue", "front-end"]
			});

			await command.run(message, ["easy"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Project: Mock Project");
			expect(embed.description).to.equal("Once upon a time");
			expect(embed.fields[0].name).to.equal("Difficulty");
			expect(embed.fields[0].value).to.equal("Easy");
			expect(embed.fields[1].name).to.equal("Tags");
			expect(embed.fields[1].value).to.equal("#easy, #vue, #front-end");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
		});
	});
});
