import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { Message } from "discord.js";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

import SearchCommand from "../../../src/commands/legacy/SearchCommand";
import Command from "../../../src/abstracts/Command";
import InstantAnswerService from "../../../src/services/InstantAnswerService";
import { EMBED_COLOURS } from "../../../src/config.json";

describe("SearchCommand", () => {
	describe("constructor()", () => {
		it("creates a command called search", () => {
			const command = new SearchCommand();

			expect(command.getName()).to.equal("search");
		});

		it("creates a command with correct description", () => {
			const command = new SearchCommand();

			expect(command.getDescription()).to.equal("Query DuckDuckGo for an instant answer.");
		});
	});

	describe("run()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: Command;
		let instantAnswer: InstantAnswerService;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new SearchCommand();
			message = BaseMocks.getMessage();
			instantAnswer = InstantAnswerService.getInstance();
		});

		it("sends a message to the channel", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(instantAnswer, "query");

			await command.run(message, ["1"]);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("states you must define a search query if none is given", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message);

			const embed = messageMock.getCall(0).firstArg.embeds[0];

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("You must define a search query.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("states it can not query duckduckgo if the result isn't found", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(instantAnswer, "query").resolves(null);

			await command.run(message, ["thisruledoesnotexist"]);

			const embed = messageMock.getCall(0).firstArg.embeds[0];

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("No results found.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("states the result from the instant answer service", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(instantAnswer, "query").resolves({
				heading: "Example Heading",
				description: "Example Description",
				url: "https://example.com"
			});

			await command.run(message, ["thisruledoesnotexist"]);

			const embed = messageMock.getCall(0).firstArg.embeds[0];

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Example Heading");
			expect(embed.description).to.equal("Example Description\n\n[View on example.com](https://example.com)");
			expect(embed.footer.text).to.equal("Result powered by the DuckDuckGo API.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		it("correctly renders URLs from websites with subdomains", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(instantAnswer, "query").resolves({
				heading: "Capybara",
				description: "The capybara is an adorable rodent.",
				url: "https://en.wikipedia.org/wiki/Capybara"
			});

			await command.run(message, ["thisruledoesnotexist"]);

			const embed = messageMock.getCall(0).firstArg.embeds[0];

			expect(embed.description).to.equal("The capybara is an adorable rodent.\n\n[View on en.wikipedia.org](https://en.wikipedia.org/wiki/Capybara)");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
