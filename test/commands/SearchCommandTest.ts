import { createSandbox, SinonSandbox, SinonStubbedInstance } from "sinon";
import { expect } from "chai";
import { CommandInteraction } from "discord.js";
import { BaseMocks } from "@lambocreeper/mock-discord.js";
import SearchCommand from "../../src/commands/SearchCommand";
import InstantAnswerService from "../../src/services/InstantAnswerService";
import { EMBED_COLOURS } from "../../src/config.json";
import NumberUtils from "../../src/utils/NumberUtils";

describe("SearchCommand", () => {
	describe("onInteract()", () => {
		let sandbox: SinonSandbox;
		let command: SearchCommand;
		let interaction: CommandInteraction;
		let replyStub: sinon.SinonStub<any[], any>;
		let instantAnswer: SinonStubbedInstance<InstantAnswerService>;

		beforeEach(() => {
			sandbox = createSandbox();
			instantAnswer = sandbox.createStubInstance(InstantAnswerService);
			command = new SearchCommand(instantAnswer);
			replyStub = sandbox.stub().resolves();
			interaction = {
				reply: replyStub,
				user: BaseMocks.getGuildMember()
			};
		});

		it("sends a message to the channel", async () => {
			instantAnswer.query;

			await command.onInteract("1", interaction);

			expect(replyStub.calledOnce).to.be.true;
		});

		it("states it can not query duckduckgo if the result isn't found", async () => {
			instantAnswer.query.resolves(null);

			await command.onInteract("thisruledoesnotexist", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Error");
			expect(embed.data.description).to.equal("No results found.");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.ERROR.toLowerCase()));
		});

		it("states the result from the instant answer service", async () => {
			instantAnswer.query.resolves({
				heading: "Example Heading",
				description: "Example Description",
				url: "https://example.com"
			});

			await command.onInteract("thisruledoesnotexist", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.data.title).to.equal("Example Heading");
			expect(embed.data.description).to.equal("Example Description\n\n[View on example.com](https://example.com)");
			expect(embed.data.footer.text).to.equal("Result powered by the DuckDuckGo API.");
			expect(embed.data.color).to.equal(NumberUtils.hexadecimalToInteger(EMBED_COLOURS.SUCCESS.toLowerCase()));
		});

		it("correctly renders URLs from websites with subdomains", async () => {
			instantAnswer.query.resolves({
				heading: "Capybara",
				description: "The capybara is an adorable rodent.",
				url: "https://en.wikipedia.org/wiki/Capybara"
			});

			await command.onInteract("thisruledoesnotexist", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(embed.data.description).to.equal("The capybara is an adorable rodent.\n\n[View on en.wikipedia.org](https://en.wikipedia.org/wiki/Capybara)");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
