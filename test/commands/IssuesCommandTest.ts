import { createSandbox, SinonSandbox } from "sinon";
import {CommandInteraction} from "discord.js";
import { expect } from "chai";
import { BaseMocks } from "@lambocreeper/mock-discord.js";
import IssuesCommand from "../../src/commands/IssuesCommand";
import GitHubService from "../../src/services/GitHubService";
import { EMBED_COLOURS } from "../../src/config.json";

describe("IssuesCommand", () => {
	describe("onInteract()", () => {
		let sandbox: SinonSandbox;
		let command: IssuesCommand;
		let interaction: CommandInteraction;
		let replyStub: sinon.SinonStub<any[], any>;
		let gitHub: GitHubService;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new IssuesCommand();
			replyStub = sandbox.stub().resolves();
			interaction = {
				reply: replyStub,
				user: BaseMocks.getGuildMember()
			};
			gitHub = GitHubService.getInstance();
		});

		it("sends a message to the channel", async () => {
			sandbox.stub(gitHub, "getIssues");
			sandbox.stub(gitHub, "getRepository");

			await command.onInteract("user", "repo", interaction);

			expect(replyStub.calledOnce).to.be.true;
		});

		it("states it had a problem with the request to GitHub", async () => {
			sandbox.stub(gitHub, "getIssues").resolves(undefined);
			sandbox.stub(gitHub, "getRepository").resolves(undefined);

			await command.onInteract("thisuserdoesnotexist", "thisrepodoesnotexist", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("There was a problem with the request to GitHub.");
			expect(embed.fields[0].name).to.equal("Correct Usage");
			expect(embed.fields[0].value).to.equal("/issues <username>/<repository>");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("states no issues have been found", async () => {
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

			await command.onInteract("user", "repo", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("No Issues found");
			expect(embed.description).to.equal("This repository has no issues. [Create one](https://github.com/codesupport/discord-bot/issues/new)");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		it("states the result from the github service", async () => {
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

			await command.onInteract("user", "repo", interaction);

			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("GitHub Issues: user/repo");
			expect(embed.description).to.equal("This is the description\n\n[View Issues on GitHub](https://github.com/codesupport/discord-bot/issues) - [Create An Issue](https://github.com/codesupport/discord-bot/issues/new)");
			expect(embed.fields[0].name).to.equal("#69 - This is the title");
			expect(embed.fields[0].value).to.equal("View on [GitHub](https://github.com/codesupport/discord-bot/issues/69) - Today by [user](https://github.com/user)");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
