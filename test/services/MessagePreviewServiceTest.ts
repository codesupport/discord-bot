import { expect } from "chai";
import { SinonSandbox, createSandbox } from "sinon";
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

		beforeEach(() => {
			sandbox = createSandbox();
			messagePreview = MessagePreviewService.getInstance();
			discordMock = new MockDiscord();
			link = "https://discord.com/channels/guild-id/518817917438001152/732711501345062982";
			callingMessage = discordMock.getMessage();
			member = discordMock.getGuildMember();
			channel = discordMock.getTextChannel();
			channel.id = "518817917438001152";
		});

		it("gets the channel from the link", async () => {
			const getsChannelMock = sandbox.stub(callingMessage.guild.channels.cache, "get").returns(channel);

			sandbox.stub(channel.messages, "fetch").resolves(callingMessage);
			sandbox.stub(callingMessage.member, "displayColor").get(() => '#FFFFFF');
			sandbox.stub(callingMessage.channel, "send");

			await messagePreview.generatePreview(link, callingMessage);

			expect(getsChannelMock.calledOnce).to.be.true;
		});

		it("sends preview message", async () => {
			const getsChannelMock = sandbox.stub(callingMessage.guild.channels.cache, "get").returns(channel);
			const sendsMessageMock = sandbox.stub(callingMessage.channel, "send");

			sandbox.stub(channel.messages, "fetch").resolves(callingMessage);
			sandbox.stub(callingMessage.member, "displayColor").get(() => '#FFFFFF');

			await messagePreview.generatePreview(link, callingMessage);

			expect(sendsMessageMock.calledOnce).to.be.true;
		});

		afterEach(() => {
			sandbox.restore();
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
});