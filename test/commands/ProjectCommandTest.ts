import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import { BaseMocks } from "@lambocreeper/mock-discord.js";
import { EMBED_COLOURS } from "../../src/config.json";
import ProjectCommand from "../../src/commands/ProjectCommand";
import NumberUtils from "../../src/utils/NumberUtils";

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
			sandbox.stub(command as ProjectCommand, "provideProjects").callsFake(() => mockProjects);
		});

		it("returns an embed to request the user to search with less args if no result is found for given args", async () => {
			await command.onInteract(Math.random().toString(36), interaction);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Error");
			expect(embed.data.description).to.equal("Could not find a project result for the given query.");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.ERROR.toLowerCase()));
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

			expect(firstCall.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.DEFAULT.toLowerCase()));
			expect(secondCall.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.DEFAULT.toLowerCase()));
			expect(thirdCall.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.DEFAULT.toLowerCase()));
			expect(lastCall.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.DEFAULT.toLowerCase()));
		});

		it("should filter out too long descriptions out of the resultset", async () => {
			await command.onInteract("6", interaction);

			const firstCall = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(firstCall.data.title).to.equal("Error");
			expect(firstCall.data.description).to.equal("Could not find a project result for the given query.");
			expect(firstCall.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.ERROR.toLowerCase()));
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
