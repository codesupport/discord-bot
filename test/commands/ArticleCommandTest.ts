import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { Message } from "discord.js";
import { BaseMocks } from "@lambocreeper/mock-discord.js";;

import ArticleCommand from "../../src/commands/ArticleCommand";
import Command from "../../src/abstracts/Command";
import ArticleService from "../../src/services/ArticleService";
import { EMBED_COLOURS } from "../../src/config.json";

describe("ArticleCommand", () => {
	describe("constructor", () => {
		it("creates a command called article", () => {
			const command = new ArticleCommand();

			expect(command.getName()).to.equal("article");
		});

		it("creates a command with correct description", () => {
			const command = new ArticleCommand();

			expect(command.getDescription()).to.equal("Shows the latest CodeSupport articles");
		});

		it("creates a command with correct aliases", () => {
			const command = new ArticleCommand();

			expect(command.getAliases().includes("articles")).to.be.true;
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
			const embed = messageMock.getCall(0).firstArg.embeds[0];

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("There was a problem with requesting the articles API.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("states the result from the ArticleService", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(article, "getLatest").resolves(
				[{
					"id": 0,
					"title": "This is a title",
					"titleId": "this-is-a-title",
					"revision": {
						"id": 0,
						"articleId": 0,
						"description": "This is a description",
						"content": "",
						"createdBy": {
							"id": 0,
							"alias": "ArticleWriter",
							"discordId": "",
							"discordUsername": "",
							"avatarLink": "",
							"disabled": false,
							"role": {
								"id": 0,
								"code": "",
								"label": ""
							},
							"joinDate": 0
						},
						"createdOn": 0
					},
					"createdBy": {
						"id": 0,
						"alias": "ArticleWriter",
						"discordId": "",
						"discordUsername": "",
						"avatarLink": "",
						"disabled": false,
						"role": {
							"id": 0,
							"code": "",
							"label": ""
						},
						"joinDate": 0
					},
					"createdOn": 0,
					"updatedBy": {
						"id": 0,
						"alias": "",
						"discordId": "",
						"discordUsername": "",
						"avatarLink": "",
						"disabled": false,
						"role": {
							"id": 0,
							"code": "",
							"label": ""
						},
						"joinDate": 0
					},
					"updatedOn": 0
				}]
			);

			await command.run(message, []);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embeds[0];

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Latest CodeSupport Articles");
			expect(embed.description).to.equal("[View all Articles](https://codesupport.dev/articles)");
			expect(embed.fields[0].name).to.equal("This is a title");
			expect(embed.fields[0].value).to.equal("This is a description \n[Read Article](https://codesupport.dev/article/this-is-a-title) - Written by [ArticleWriter](https://codesupport.dev/profile/articlewriter)");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
