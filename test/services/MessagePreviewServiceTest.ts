import { expect } from "chai";
import { SinonSandbox, createSandbox, SinonStub } from "sinon";
import MessagePreviewService from "../../src/services/MessagePreviewService";
import { Message, TextChannel, GuildMember } from "discord.js";
import MockDiscord from "../MockDiscord";

describe("MessagePreviewService", () => {
	describe("::getInstance()", () => {
		it("returns an instance of MessagePreviewService", () => {
			const service = MessagePreviewService.getInstance();

			expect(service).to.be.instanceOf(MessagePreviewService);
		});
	});

	describe("generatePreview()", () => {
		let sandbox: SinonSandbox;
		let messagePreview: MessagePreviewService;
		let link: string;
		let callingMessage: Message;
		let member: GuildMember;
		let channel: TextChannel;
		let discordMock: MockDiscord;
		let getChannelMock: SinonStub;
		let sendMessageMock: SinonStub;

		beforeEach(() => {
			sandbox = createSandbox();

			messagePreview = MessagePreviewService.getInstance();

			discordMock = new MockDiscord();
			callingMessage = discordMock.getMessage();
			member = discordMock.getGuildMember();
			channel = discordMock.getTextChannel();

			link = "https://discord.com/channels/guild-id/518817917438001152/732711501345062982";
			channel.id = "518817917438001152";

			getChannelMock = sandbox.stub(callingMessage.guild.channels.cache, "get").returns(channel);
			sendMessageMock = sandbox.stub(callingMessage.channel, "send");

			sandbox.stub(channel.messages, "fetch").resolves(callingMessage);
			sandbox.stub(callingMessage.member, "displayColor").get(() => "#FFFFFF");
		});

		it("gets the channel from the link", async () => {
			await messagePreview.generatePreview(link, callingMessage);

			expect(getChannelMock.calledOnce).to.be.true;
		});

		it("sends preview message", async () => {
			await messagePreview.generatePreview(link, callingMessage);

			expect(sendMessageMock.calledOnce).to.be.true;
		});

		it("escapes hyperlinks", async () => {
			const escapeHyperlinksMock = sandbox.stub(messagePreview, "escapeHyperlinks").returns("Parsed message");

			await messagePreview.generatePreview(link, callingMessage);

			expect(escapeHyperlinksMock.calledOnce);
		});

		it("doesn't send preview message if it is a bot message", async () => {
			callingMessage.author.bot = true;

			expect(sendMessageMock.called).to.be.false;
		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe("verifyGuild()", () => {
		const messagePreview = MessagePreviewService.getInstance();
		const discordMock = new MockDiscord();
		const message = discordMock.getMessage();

		it("should return true if message's guild and provided guild id match", () => {
			message.guild.id = "RANDOM_GUILD_ID";

			expect(messagePreview.verifyGuild(message, "RANDOM_GUILD_ID")).to.be.true;
		});

		it("should return false if message's guild and provided guild id don't match", () => {
			message.guild.id = "RANDOM_GUILD_ID";

			expect(messagePreview.verifyGuild(message, "OTHER_GUILD_ID")).to.be.false;
		});
	});

	describe("stripLink()", () => {
		let sandbox: SinonSandbox;
		let messagePreview: MessagePreviewService;
		let link: string;

		beforeEach(() => {
			sandbox = createSandbox();
			messagePreview = MessagePreviewService.getInstance();
			link = "https://ptb.discordapp.com/channels/240880736851329024/518817917438001152/732711501345062982";
		});

		it("strips link of unnecessary details", () => {
			const array = messagePreview.stripLink(link);

			expect(array).to.include("240880736851329024");
			expect(array).to.include("518817917438001152");
			expect(array).to.include("732711501345062982");
		});

		afterEach(() => {
			sandbox.restore();
		});
	});

	describe("escapeHyperlinks()", () => {
		let sandbox: SinonSandbox;
		let messagePreview: MessagePreviewService;

		beforeEach(() => {
			sandbox = createSandbox();
			messagePreview = MessagePreviewService.getInstance();
		});

		it("should return the string as it is if there are no hyperlinks", () => {
			expect(messagePreview.escapeHyperlinks("I am the night")).to.equal("I am the night");
		});

		it("should escape hyperlinks", () => {
			expect(messagePreview.escapeHyperlinks("Do you feel lucky, [punk](punkrock.com)?"))
				.to.equal("Do you feel lucky, \\[punk\\]\\(punkrock.com\\)?");
		});

		it("should scape all hyperlinks if there is more than one", () => {
			expect(messagePreview.escapeHyperlinks("[Link1](l1.com) and [Link2](l2.com)"))
				.to.equal("\\[Link1\\]\\(l1.com\\) and \\[Link2\\]\\(l2.com\\)");
		});

		it("should escape hyperlinks even if they are empty", () => {
			expect(messagePreview.escapeHyperlinks("[]()")).to.equal("\\[\\]\\(\\)");
			expect(messagePreview.escapeHyperlinks("[half]()")).to.equal("\\[half\\]\\(\\)");
			expect(messagePreview.escapeHyperlinks("[](half)")).to.equal("\\[\\]\\(half\\)");
		});
	});
});