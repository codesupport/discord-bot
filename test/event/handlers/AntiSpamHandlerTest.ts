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

		function createBotCounterMessage(count: number, overrides: Partial<any> = {}) {
			return {
				id: "bot-message-id",
				content: `**${count}** spam accounts banned.`,
				author: { id: "bot-id" },
				embeds: [],
				edit: sandbox.stub().resolves(),
				...overrides
			};
		}
		function setupAntiSpamChannelWithMessages(messages: any[]) {
			const fakeAntiSpamChannel = {
				id: ANTISPAM_CHANNEL_ID,
				messages: {
					fetch: sandbox.stub().resolves({
						some: (fn: any) => messages.some(fn),
						find: (fn: any) => messages.find(fn)
					})
				},
				send: sandbox.stub().resolves()
			};

			messageMock.guild.channels.fetch = sandbox.stub().callsFake(async (id: string) => {
				if (id === ANTISPAM_CHANNEL_ID) return fakeAntiSpamChannel;
				if (id === LOG_CHANNEL_ID) return logsChannelMock;
				return null;
			});

			return fakeAntiSpamChannel;
		}
		function setupFetchWithRetries(failuresBeforeSuccess: number | null, fakeAntiSpamChannel: any) {
			let callCount = 0;

			messageMock.guild.channels.fetch = sandbox.stub().callsFake(async (id: string) => {
				if (id === LOG_CHANNEL_ID) {
					return logsChannelMock;
				}

				if (id === ANTISPAM_CHANNEL_ID) {
					if (failuresBeforeSuccess === null) {
						// Always fail
						return null;
					}

					if (callCount < failuresBeforeSuccess) {
						callCount++;
						return null;
					}

					return fakeAntiSpamChannel;
				}

				return null;
			});
		}

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

			const mockBotMessage = {
				id: "12345",
				content: "**0** spam accounts banned.",
				author: { id: "bot-id" },
				edit: sandbox.stub().resolves()
			};

			// Update your messageMock
			const fakeAntiSpamChannel = {
				id: ANTISPAM_CHANNEL_ID,
				messages: {
					fetch: sandbox.stub().resolves({
						// Mocking the collection returned by fetch
						some: () => true,
						find: () => mockBotMessage
					})
				},
				send: sandbox.stub().resolves(mockBotMessage)
			};

			logsChannelMock = {
				send: sandbox.stub().resolves()
			};

			// 4. The Main Message Mock
			messageMock = {
				client: { user: { id: "bot-id" } },
				author: { bot: false, username: "testuser" },
				member: {
					id: "user-id",
					user: { username: "testuser" },
					ban: sandbox.stub().resolves()
				},
				channel: { id: ANTISPAM_CHANNEL_ID },
				guild: {
					channels: {
						// This handles your retry loop and the logs fetch
						fetch: sandbox.stub().callsFake(async id => {
							if (id === ANTISPAM_CHANNEL_ID) return fakeAntiSpamChannel;
							if (id === LOG_CHANNEL_ID) return logsChannelMock;
							return null;
						})
					}
				}
			};
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

		[
			[0, 1],
			[4, 5],
			[9, 10],
			[10, 11],
			[99, 100],
			[100, 101],
			[192831923, 192831924]
		].forEach(([from, to]) => {
			it(`counter already existing, modified correctly (${from} -> ${to})`, async () => {
				const botMessage = createBotCounterMessage(from);

				setupAntiSpamChannelWithMessages([botMessage]);

				await handler.handle(messageMock);

				expect(botMessage.edit.calledOnce).to.be.true;
				expect(botMessage.edit.firstCall.args[0]).to.equal(`**${to}** spam accounts banned.`);
			});
		});

		it("counter not already existing, created correctly (counter = 1)", async () => {
			const fakeChannel = setupAntiSpamChannelWithMessages([]);

			await handler.handle(messageMock);

			expect(fakeChannel.send.calledOnce).to.be.true;
			expect(fakeChannel.send.firstCall.args[0]).to.equal("**1** spam account has been banned.");
		});

		it("counter does not modify a previous message which contains embeds", async () => {
			const botMessageWithEmbed = createBotCounterMessage(5, {
				embeds: [{}]
			});

			setupAntiSpamChannelWithMessages([botMessageWithEmbed]);

			await handler.handle(messageMock);

			expect(botMessageWithEmbed.edit.called).to.be.false;
		});

		it("counter does not modify a previous message sent by another user", async () => {
			const userMessage = createBotCounterMessage(5, {
				author: { id: "some-user-id" }
			});

			setupAntiSpamChannelWithMessages([userMessage]);

			await handler.handle(messageMock);

			expect(userMessage.edit.called).to.be.false;
		});

		it("counter does not modify a previous message sent by another bot", async () => {
			const otherBotMessage = createBotCounterMessage(5, {
				author: { id: "another-bot-id" }
			});

			setupAntiSpamChannelWithMessages([otherBotMessage]);

			await handler.handle(messageMock);

			expect(otherBotMessage.edit.called).to.be.false;
		});

		[
			{ failures: 1, shouldSucceed: true },
			{ failures: 2, shouldSucceed: true },
			{ failures: 3, shouldSucceed: true },
			{ failures: 4, shouldSucceed: true },
			{ failures: 5, shouldSucceed: false}
		].forEach(({ failures, shouldSucceed }) => {
			it(`retry logic: fetch fails ${failures} time(s) → ${shouldSucceed ? "succeeds" : "gives up"}`, async () => {
				const botMessage = createBotCounterMessage(0);
				const fakeChannel = setupAntiSpamChannelWithMessages([botMessage]);

				let callCount = 0;

				messageMock.guild.channels.fetch = sandbox.stub().callsFake(async (id: string) => {
					if (id === LOG_CHANNEL_ID) {
						return logsChannelMock;
					}

					if (id === ANTISPAM_CHANNEL_ID) {
						callCount++;
						return callCount <= failures ? null : fakeChannel;
					}

					return null;
				});

				await handler.handle(messageMock);

				// Inline conditionals for assertions
				expect(botMessage.edit.called).to.equal(shouldSucceed);
				expect(messageMock.member.ban.calledOnce).to.be.true;
				expect(logsChannelMock.send.called).to.equal(true);
			});
		});

		afterEach(() => {
			sandbox.restore();
		});
	});
});
