import { expect } from "chai";
import { SinonSandbox, createSandbox } from "sinon";
import axios from "axios";
import { BaseMocks } from "@lambocreeper/mock-discord.js";
import NPMCommand from "../../../src/commands/slash/NPMCommand";
import { EMBED_COLOURS } from "../../../src/config.json";

describe("NPMCommand", () => {
	describe("run()", () => {
		let sandbox: SinonSandbox;
		let command: NPMCommand;
		let interaction: any;
		let replyStub: sinon.SinonStub<any[], any>;

		beforeEach(() => {
			sandbox = createSandbox();
			command = new NPMCommand();
			replyStub = sandbox.stub().resolves();
			interaction = {
				reply: replyStub,
				user: BaseMocks.getGuildMember()
			};
		});

		it("sends a message to the channel", async () => {
			sandbox.stub(axios, "get");

			await command.onInteract("discord.js", interaction);

			expect(replyStub.calledOnce).to.be.true;
		});

		it("states the package name is not valid if it doesn't find a package", async () => {
			sandbox.stub(axios, "get").rejects({ status: 404 });

			await command.onInteract("mongoboy", interaction);

			const embed = replyStub.getCall(0).lastArg.embeds[0];

			expect(replyStub.calledOnce).to.be.true;
			expect(embed.title).to.equal("Error");
			expect(embed.description).to.equal("That is not a valid NPM package.");
			expect(embed.hexColor).to.equal(EMBED_COLOURS.ERROR.toLowerCase());
		});

		it("sends a message with the package URL if you provide a valid package", async () => {
			sandbox.stub(axios, "get").resolves({ status: 200 });

			await command.onInteract("factory-girl", interaction);

			const url = replyStub.getCall(0).lastArg;

			expect(replyStub.calledOnce).to.be.true;
			expect(url).to.equal("https://www.npmjs.com/package/factory-girl");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
