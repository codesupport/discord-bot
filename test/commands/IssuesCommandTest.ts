import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { Message } from "discord.js";

// @ts-ignore
import MockDiscord from "../MockDiscord";
import IssuesCommand from "../../src/commands/IssuesCommand";
import Command from "../../src/abstracts/Command";
import GitHubService from "../../src/services/GitHubService";
import { EMBED_COLOURS } from "../../src/config.json";

describe("IssuesCommand", () => {
	describe("constructor", () => {
		it("creates a command called issues", () => {
			const command = new IssuesCommand();

			expect(command.getName()).to.equal("issues");
		});

		it("creates a command with correct description", () => {
			const command = new IssuesCommand();

			expect(command.getDescription()).to.equal("Shows all the issues of the given repository.");
		});
	});

	describe("run()", () => {
		let sandbox: SinonSandbox;
		let message: Message;
		let command: Command;
		let discordMock: MockDiscord;
		let gitHub: GitHubService;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new IssuesCommand();
			discordMock = new MockDiscord();
			message = discordMock.getMessage();
			gitHub = GitHubService.getInstance();
		});

		it("sends a message to the channel", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(gitHub, "getIssues");
			sandbox.stub(gitHub, "getRepository");

			await command.run(message, ["user/repo"]);

			expect(messageMock.calledOnce).to.be.true;
		});

		it("states you must define a username and repository if none is given", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, []);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("You must provide a username and repo from GitHub.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("states you must define a username and repository if the formatting is not correct", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			await command.run(message, ["wrongformat"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("You must provide a username and repo from GitHub.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("states it had a problem with the request to GitHub", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(gitHub, "getIssues").resolves(null);
			sandbox.stub(gitHub, "getRepository").resolves(null);

			await command.run(message, ["thisuserdoesnotexist/thisrepodoesnotexist"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("There was a problem with the request to GitHub.");
			expect(embed.fields[0].name).to.equal("Correct Usage");
			expect(embed.fields[0].value).to.equal("?issues <username>/<repository>");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("states no issues have been found", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(gitHub, "getIssues").resolves(
				[]
			);

			sandbox.stub(gitHub, "getRepository").resolves({
				user: "user",
				repo: "repo",
				description: "This is the description",
				language: "TypeScript",
				url: "https://github.com/codesupport/discord-bot",
				issues_and_pullrequests_count: 3,
				forks: 5,
				stars: 10,
				watchers: 3
			});

			await command.run(message, ["user/repo"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("No Issues found");
			expect(embed.description).to.equal("This repository has no issues. [Create one](https://github.com/codesupport/discord-bot/issues/new)");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		it("states the result from the github service", async () => {
			const messageMock = sandbox.stub(message.channel, "send");

			sandbox.stub(gitHub, "getIssues").resolves(
				[{
					title: "This is the title",
					number: 69,
					author: "user",
					author_url: "https://github.com/user",
					issue_url: "https://github.com/codesupport/discord-bot/issues/69",
					created_at: new Date(Date.now() - 1000)
				}]
			);

			sandbox.stub(gitHub, "getRepository").resolves({
				user: "user",
				repo: "repo",
				description: "This is the description",
				language: "TypeScript",
				url: "https://github.com/codesupport/discord-bot",
				issues_and_pullrequests_count: 3,
				forks: 5,
				stars: 10,
				watchers: 3
			});

			await command.run(message, ["user/repo"]);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = messageMock.getCall(0).firstArg.embed;

			expect(messageMock.calledOnce).to.be.true;
			expect(embed.title).to.equal("GitHub Issues: user/repo");
			expect(embed.description).to.equal("This is the description\n\n[View Issues on GitHub](https://github.com/codesupport/discord-bot/issues) - [Create An Issue](https://github.com/codesupport/discord-bot/issues/new)");
			expect(embed.fields[0].name).to.equal("#69 - This is the title");
			expect(embed.fields[0].value).to.equal("View on [GitHub](https://github.com/codesupport/discord-bot/issues/69) - today by [user](https://github.com/user)");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});