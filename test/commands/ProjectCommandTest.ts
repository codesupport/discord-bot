import { expect } from "chai";
import { Message } from "discord.js";
import { createSandbox, SinonSandbox } from "sinon";
import { BaseMocks } from "@lambocreeper/mock-discord.js";
import Command from "../../src/abstracts/Command";
import { EMBED_COLOURS } from "../../src/config.json";
import ProjectCommand from "../../src/commands/ProjectCommand";

describe("ProjectCommand", () => {
	describe("constructor", () => {
		const command = new ProjectCommand();

		it("Should have the name 'Project'", () => {
			expect(command.getName()).to.equal("project");
		});

		it("Should set the correct description", () => {
			expect(command.getDescription()).to.equal("Returns a random project idea based on given parameters.");
		});
	});

	describe("run()", () => {
		const command: Command = new ProjectCommand();
		const mockProjects: Array<any> = [
			{
				title: Math.random().toString(36),
				tags: ["1", "hard"],
				description: Math.random().toString(36)
			},
			{
				title: Math.random().toString(36),
				tags: ["2", "3", "default"],
				description: Math.random().toString(36)
			},
			{
				title: Math.random().toString(36),
				tags: ["4", "medium"],
				description: Math.random().toString(36)
			},
			{
				title: Math.random().toString(36),
				tags: ["5", "easy"],
				description: Math.random().toString(36)
			},
			{
				title: Math.random().toString(36),
				tags: ["6"],
				description: [...Array(100)].map(() => Math.random().toString(36)).join(Math.random().toString(36))
			}
		];
		let sandbox: SinonSandbox;
		let message: Message;

		beforeEach(() => {
			sandbox = createSandbox();
			message = BaseMocks.getMessage();
			sandbox.stub(command as ProjectCommand, "provideProjects").callsFake(() => mockProjects);
		});

		afterEach(() => {
			sandbox.restore();
		});

		it("returns an embed to request the user to search with less args if no result is found for given args", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, [Math.random().toString(36)]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("Could not find a project result for the given query.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("should assign the correct colors for difficulty grade if difficulty grade is specified", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["default"]);
			await command.run(message, ["easy"]);
			await command.run(message, ["medium"]);
			await command.run(message, ["hard"]);

			// @ts-ignore - firstArg does not live on getCall()
			const firstCall = messageMock.getCall(0).firstArg;
			// @ts-ignore - firstArg does not live on getCall()
			const secondCall = messageMock.getCall(1).firstArg;
			// @ts-ignore - firstArg does not live on getCall()
			const thirdCall = messageMock.getCall(2).firstArg;
			// @ts-ignore - firstArg does not live on getCall()
			const lastCall = messageMock.getCall(3).firstArg;

			expect(firstCall.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
			expect(secondCall.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
			expect(thirdCall.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
			expect(lastCall.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
		});

		it("should filter out too long descriptions out of the resultset", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["6"]);

			// @ts-ignore - firstArg does not live on getCall()
			const firstCall = messageMock.getCall(0).firstArg;

			expect(messageMock.calledOnce).to.be.true;
			expect(firstCall.title).to.equal("Error");
			expect(firstCall.description).to.equal("Could not find a project result for the given query.");
			expect(firstCall.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("should return instructions on how to use the command if no args are provided", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, []);

			// @ts-ignore - firstArg does not live on getCall()
			const firstCall = messageMock.getCall(0).firstArg;

			expect(messageMock.calledOnce).to.be.true;
			expect(firstCall.title).to.equal("Error");
			expect(firstCall.description).to.equal("You must provide a search query/tag.");
			expect(firstCall.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});
	});
});
