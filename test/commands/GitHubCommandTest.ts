import { createSandbox, SinonSandbox } from "sinon";
import { expect } from "chai";
import { BaseMocks } from "@lambocreeper/mock-discord.js";

import GitHubCommand from "../../src/commands/GitHubCommand";
import GitHubService from "../../src/services/GitHubService";
import { EMBED_COLOURS } from "../../src/config.json";

describe("GitHubCommand", () => {
	describe("onInteract()", () => {
		let sandbox: SinonSandbox;
		let command: GitHubCommand;
		let gitHub: GitHubService;
		let replyStub: sinon.SinonStub<any[], any>;
		let interaction: any;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new GitHubCommand();
			gitHub = GitHubService.getInstance();
			replyStub = sandbox.stub().resolves();
			interaction = {
				reply: replyStub,
				user: BaseMocks.getGuildMember()
			};
		});

		it("sends a message to the channel", async () => {
			sandbox.stub(gitHub, "getRepository");
			sandbox.stub(gitHub, "getPullRequest");

			await command.onInteract("user", "repo", interaction);

			expect(replyStub.calledOnce).to.be.true;
		});

		it("states it had a problem with the request to GitHub", async () => {
			sandbox.stub(gitHub, "getRepository").resolves(undefined);
			sandbox.stub(gitHub, "getPullRequest").resolves(undefined);

			await command.onInteract("thisuserdoesnotexist", "thisrepodoesnotexist", interaction);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("There was a problem with the request to GitHub.");
			expect(embed.fields[0].name).to.equal("Correct Usage");
			expect(embed.fields[0].value).to.equal("?github <username>/<repository>");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("states the result from the github service", async () => {
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

			sandbox.stub(gitHub, "getPullRequest").resolves(
				[{
					title: "This is the title",
					description: "This is the description",
					author: "user"
				}]
			);

			await command.onInteract("user", "repo", interaction);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("GitHub Repository: user/repo");
			expect(embed.description).to.equal("This is the description\n\n[View on GitHub](https://github.com/codesupport/discord-bot)");
			expect(embed.fields[0].name).to.equal("Language");
			expect(embed.fields[0].value).to.equal("TypeScript");
			expect(embed.fields[1].name).to.equal("Open issues");
			expect(embed.fields[1].value).to.equal("2");
			expect(embed.fields[2].name).to.equal("Open Pull Requests");
			expect(embed.fields[2].value).to.equal("1");
			expect(embed.fields[3].name).to.equal("Forks");
			expect(embed.fields[3].value).to.equal("5");
			expect(embed.fields[4].name).to.equal("Stars");
			expect(embed.fields[4].value).to.equal("10");
			expect(embed.fields[5].name).to.equal("Watchers");
			expect(embed.fields[5].value).to.equal("3");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.SUCCESS.toLowerCase());
		});

		it("states the result from the github service with an empty repo description", async () => {
			sandbox.stub(gitHub, "getRepository").resolves({
				user: "user",
				repo: "repo",
				description: undefined,
				language: "TypeScript",
				url: "https://github.com/codesupport/discord-bot",
				issues_and_pullrequests_count: 3,
				forks: 5,
				stars: 10,
				watchers: 3
			});

			sandbox.stub(gitHub, "getPullRequest").resolves(
				[{
					title: "This is the title",
					description: "This is the description",
					author: "user"
				}]
			);

			await command.onInteract("user", "repo", interaction);

			// @ts-ignore - firstArg does not live on getCall()
			const embed = replyStub.getCall(0).firstArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.description).to.equal("[View on GitHub](https://github.com/codesupport/discord-bot)");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
