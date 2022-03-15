import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import { BaseMocks } from "@lambocreeper/mock-discord.js";
import { EMBED_COLOURS } from "../../../src/config.json";
import ProjectCommand from "../../../src/commands/slash/ProjectCommand";

describe("ProjectCommand", () => {
	describe("onInteract()", () => {
		let command: ProjectCommand;
		let sandbox: SinonSandbox;
		let interaction: any;
		let replyStub: sinon.SinonStub<any[], any>;

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

		beforeEach(() => {
			sandbox = createSandbox();
			command = new ProjectCommand();
			replyStub = sandbox.stub().resolves();
			interaction = {
				reply: replyStub,
				user: BaseMocks.getGuildMember()
			};
		});

		it("returns an embed to request the user to search with less args if no result is found for given args", async () => {
			await command.onInteract(Math.random().toString(36), interaction);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("Could not find a project result for the given query.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("should assign the correct colors for difficulty grade if difficulty grade is specified", async () => {
			await command.onInteract("default", interaction);
			await command.onInteract("easy", interaction);
			await command.onInteract("medium", interaction);
			await command.onInteract("hard", interaction);

			const firstCall = replyStub.getCall(0).firstArg.embeds[0];
			const secondCall = replyStub.getCall(1).firstArg.embeds[0];
			const thirdCall = replyStub.getCall(2).firstArg.embeds[0];
			const lastCall = replyStub.getCall(3).firstArg.embeds[0];

			expect(firstCall.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
			expect(secondCall.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
			expect(thirdCall.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
			expect(lastCall.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());
		});
/*
		it("should filter out too long descriptions out of the resultset", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["6"]);

			const firstCall = messageMock.getCall(0).firstArg.embeds[0];

			expect(messageMock.calledOnce).to.be.true;
			expect(firstCall.title).to.equal("Error");
			expect(firstCall.description).to.equal("Could not find a project result for the given query.");
			expect(firstCall.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("should return instructions on how to use the command if no args are provided", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, []);

			const firstCall = messageMock.getCall(0).firstArg.embeds[0];

			expect(messageMock.calledOnce).to.be.true;
			expect(firstCall.title).to.equal("Error");
			expect(firstCall.description).to.equal("You must provide a search query/tag.");
			expect(firstCall.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});
		*/

		afterEach(() => {
			sandbox.restore();
		});
	});
});
