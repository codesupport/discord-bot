import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { Message } from "discord.js";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

import ArticleCommand from "../../src/commands/ArticleCommand";
import Command from "../../src/abstracts/Command";
import ArticleService from "../../src/services/ArticleService";
import { EMBED_COLOURS } from "../../src/config.json";

describe("ArticleCommand", () => {
	describe("constructor", () => {
		it("creates a command called issues", () => {
			const command = new ArticleCommand();

			expect(command.getName()).to.equal("article");
		});

		it("creates a command with correct description", () => {
			const command = new ArticleCommand();

			expect(command.getDescription()).to.equal("Shows the latest CodeSupport articles");
		});
	});

	describe("run()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: Command;
		let article: ArticleService;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new ArticleCommand();
			message = BaseMocks.getMessage();
			article = ArticleService.getInstance();
		});

		it("sends a message to the channel", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(article, "getLatest");

			await command.run(message, []);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("states it had a problem with the request to the CodeSupport Article Api", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(article, "getLatest").resolves(undefined);

			await command.run(message, []);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("There was a problem with requesting the articles API.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("states the result from the github service", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(article, "getLatest").resolves(
				[{
					title: "This is the title",
					description: "This is the description",
					author: "user",
					author_url: "https://codesupport.com/profile/user",
					article_url: "https://codesupport.com/article/this-is-the-title"
				}]
			);

			await command.run(message, []);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Latest CodeSupport Articles");
			expect(embed.description).to.equal("[View all Articles](https://codesupport.dev/articles)");
			expect(embed.fields[0].name).to.equal("This is the title");
			expect(embed.fields[0].value).to.equal("This is the description \n[Read Article](https://codesupport.com/article/this-is-the-title) - Written by [user](https://codesupport.com/profile/user)");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});