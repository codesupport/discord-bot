import {expect} from "chai";
import {createSandbox, match, SinonSandbox, SinonStub} from "sinon";
import AntiSpamHandler from "../../../src/event/handlers/AntiSpamHandler";
import * as getConfigValueModule from "../../../src/utils/getConfigValue";
import {Events} from "discord.js";
import EventHandler from "../../../src/abstracts/EventHandler";
import {BaseMocks, CustomMocks} from "@lambocreeper/mock-discord.js";

describe("AntiSpamHandler", () => {
	describe("constructor()", () => {
		it("creates a handler for messageCreate", () => {
			const handler = new AntiSpamHandler();

			expect(handler.getEvent()).to.equal(Events.MessageCreate);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;
		let handler: EventHandler;
		let messageMock: any;
		let memberMock: any;
		let logsChannelMock: any;
		let getConfigValueStub: SinonStub;
		const ANTISPAM_CHANNEL_ID = "antispam";
		const LOG_CHANNEL_ID = "logs";

		beforeEach(() => {
			sandbox = createSandbox();
			handler = new AntiSpamHandler();
			getConfigValueStub = sandbox.stub(getConfigValueModule, "default");
			getConfigValueStub.withArgs("ANTISPAM_CHANNEL_ID").returns(ANTISPAM_CHANNEL_ID);
			getConfigValueStub.withArgs("LOG_CHANNEL_ID").returns(LOG_CHANNEL_ID);

			memberMock = BaseMocks.getGuildMember();
			sandbox.stub(memberMock, "ban").resolves();

			logsChannelMock = BaseMocks.getTextChannel();
			sandbox.stub(logsChannelMock, "send").resolves();

			messageMock = {
				channel: CustomMocks.getGuildChannel({id: ANTISPAM_CHANNEL_ID}),
				guild: {
					channels: {
						fetch: sandbox.stub().resolves(logsChannelMock)
					}
				},
				member: memberMock,
				author: CustomMocks.getUser({bot: false})
			};
		});

		afterEach(() => {
			sandbox.restore();
		});

		it("bans user with deleteMessageSeconds and logs when message is in anti-spam channel", async () => {
			await handler.handle(messageMock);
			expect(messageMock.member.ban.calledOnce).to.be.true;
			const banArgs = messageMock.member.ban.getCall(0).args[0];

			expect(banArgs).to.include({deleteMessageSeconds: 60 * 60});
			expect(banArgs.reason).to.match(/anti-spam/);
			expect(await messageMock.guild.channels.fetch(LOG_CHANNEL_ID)).to.equal(logsChannelMock);
			expect(logsChannelMock.send.calledWithMatch(match(/banned/))).to.be.true;
		});

		it("does nothing if message author is bot", async () => {
			messageMock.author.bot = true;
			await handler.handle(messageMock);
			expect(messageMock.member.ban.called).to.be.false;
		});

		it("does nothing if not in anti-spam channel", async () => {
			messageMock.channel.id = "other";
			await handler.handle(messageMock);
			expect(messageMock.member.ban.called).to.be.false;
		});

		it("does nothing if no guild", async () => {
			messageMock.guild = undefined;
			await handler.handle(messageMock);
			expect(messageMock.member.ban.called).to.be.false;
		});

		it("does nothing if no member", async () => {
			messageMock.member = undefined;
			await handler.handle(messageMock);
			expect(memberMock.ban.called).to.be.false;
			expect(logsChannelMock.send.called).to.be.false;
		});
	});
});
