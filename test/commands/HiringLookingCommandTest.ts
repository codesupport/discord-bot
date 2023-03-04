import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

import { EMBED_COLOURS } from "../../src/config.json";
import HiringLookingCommand from "../../src/commands/HiringLookingCommand";
import getConfigValue from "../../src/utils/getConfigValue";
import GenericObject from "../../src/interfaces/GenericObject";

describe("HiringLookingCommand", () => {
	describe("onInteract()", () => {
		let sandbox: SinonSandbox;
		let command: HiringLookingCommand;
		let replyStub: sinon.SinonStub<any[], any>;
		let interaction: any;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new HiringLookingCommand();
			replyStub = sandbox.stub().resolves();
			interaction = {
				reply: replyStub,
				user: BaseMocks.getGuildMember()
			};
		});

		it("sends a message to the channel", async () => {
			await command.onInteract(interaction);

			expect(replyStub.calledOnce).to.be.true;
		});

		it("states how to format a post", async () => {
			await command.onInteract(interaction);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Hiring or Looking Posts");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.DEFAULT.toLowerCase());

			// The indentation on these is a mess due to the test comparing white space.
			expect(embed.description).to.equal(`
			CodeSupport offers a free to use hiring or looking section.\n
			Here you can find people to work for you and offer your services,
			as long as it fits in with the rules. If you get scammed in hiring or looking there is
			nothing we can do, however, we do ask that you let a moderator know.
		`);
			expect(embed.fields[0].name).to.equal("Payment");
			expect(embed.fields[0].value).to.equal("If you are trying to hire people for a project, and that project is not open source, your post must state how much you will pay them (or a percentage of profits they will receive).");
			expect(embed.fields[1].name).to.equal("Post Frequency");
			expect(embed.fields[1].value).to.equal(`Please only post in <#${getConfigValue<GenericObject<string>>("BOTLESS_CHANNELS").HIRING_OR_LOOKING}> once per week to keep the channel clean and fair. Posting multiple times per week will lead to your access to the channel being revoked.`);
			expect(embed.fields[2].name).to.equal("Example Post");
			expect(embed.fields[2].value).to.equal(`
			Please use the example below as a template to base your post on.\n
			\`\`\`
[HIRING]
Full Stack Website Developer
We are looking for a developer who is willing to bring our video streaming service to life.
Pay: $20/hour
Requirements:
- Solid knowledge of HTML, CSS and JavaScript
- Knowledge of Node.js, Express and EJS.
- Able to turn Adobe XD design documents into working web pages.
- Able to stick to deadlines and work as a team.
			\`\`\`
		`);
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
