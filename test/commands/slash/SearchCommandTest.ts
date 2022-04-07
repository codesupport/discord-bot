import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import {CommandInteraction} from "discord.js";
import { BaseMocks } from "@lambocreeper/mock-discord.js";
import SearchCommand from "../../../src/commands/slash/SearchCommand";
import InstantAnswerService from "../../../src/services/InstantAnswerService";
import { EMBED_COLOURS } from "../../../src/config.json";
import searchCommand from "../../../src/commands/slash/SearchCommand";

describe("SearchCommand", () => {
	describe("onInteract()", () => {
		let sandbox: SinonSandbox;
		let command: searchCommand;
		let interaction: CommandInteraction;
		let replyStub: sinon.SinonStub<any[], any>;
		let instantAnswer: InstantAnswerService;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new SearchCommand();
			replyStub = sandbox.stub().resolves();
			interaction = {
				reply: replyStub,
				user: BaseMocks.getGuildMember()
			};
			instantAnswer = InstantAnswerService.getInstance();
		});

		it("sends a message to the channel", async () => {
			sandbox.stub(instantAnswer, "query");

			await command.onInteract("1", interaction);

			expect(replyStub.calledOnce).to.be.true;
		});

		it("states it can not query duckduckgo if the result isn't found", async () => {
			sandbox.stub(instantAnswer, "query").resolves(null);

			await command.onInteract("thisruledoesnotexist", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("No results found.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("states the result from the instant answer service", async () => {
			sandbox.stub(instantAnswer, "query").resolves({
				heading: "Example Heading",
				description: "Example Description",
				url: "https://example.com"
			});

			await command.onInteract("thisruledoesnotexist", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Example Heading");
			expect(embed.description).to.equal("Example Description\n\n[View on example.com](https://example.com)");
			expect(embed.footer.text).to.equal("Result powered by the DuckDuckGo API.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		it("correctly renders URLs from websites with subdomains", async () => {
			sandbox.stub(instantAnswer, "query").resolves({
				heading: "Capybara",
				description: "The capybara is an adorable rodent.",
				url: "https://en.wikipedia.org/wiki/Capybara"
			});

			await command.onInteract("thisruledoesnotexist", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(embed.description).to.equal("The capybara is an adorable rodent.\n\n[View on en.wikipedia.org](https://en.wikipedia.org/wiki/Capybara)");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
