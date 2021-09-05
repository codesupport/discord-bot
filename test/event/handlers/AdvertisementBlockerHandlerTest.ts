// Using bracket notation to bypass private access levels for tests
/* eslint-disable dot-notation */
import { expect } from "chai";
import AdvertisementBlockerHandler from "../../../src/event/handlers/AdvertisementBlockerHandler";
import {MEMBER_ROLE} from "../../../src/config.json";
import Discord from "discord.js";
import {SinonSandbox, createSandbox} from "sinon";

let env: NodeJS.ProcessEnv;

// @ts-ignore
const ROLE_MEMBER: Discord.Role = {id: MEMBER_ROLE};
// @ts-ignore
const ROLE_OTHER: Discord.Role = {id: "11"};

// Messages should be tracked
const MEMBER_SHOULD_TRACK: Discord.GuildMember = {
	id: "memberid123",
	nickname: "MemberShouldBeTracked",
	joinedTimestamp: new Date().getTime(),
	roles: {
		// @ts-ignore
		cache: {
			size: 2,
			some(fn: any): boolean {
				return fn(ROLE_MEMBER);
			}
		}
	}
};

// Messages should not be tracked
const MEMBER_TOO_OLD: Discord.GuildMember = {
	id: "memberid123",
	joinedTimestamp: 5,
	roles: {
		// @ts-ignore
		cache: {
			size: 2,
			some(fn: any): boolean {
				return fn(ROLE_MEMBER);
			}
		}
	}
};
const MEMBER_NOT_ONLY_MEMBER_ROLE: Discord.GuildMember = {
	id: "memberid123",
	joinedTimestamp: new Date().getTime(),
	roles: {
		// @ts-ignore
		cache: {
			size: 3,
			some(fn: any): boolean {
				return fn(ROLE_MEMBER);
			}
		}
	}
};
const MEMBER_NO_MEMBER_ROLE: Discord.GuildMember = {
	id: "memberid123",
	joinedTimestamp: new Date().getTime(),
	roles: {
		// @ts-ignore
		cache: {
			size: 2,
			some(fn: any): boolean {
				return fn(ROLE_OTHER);
			}
		}
	}
};

describe("AdvertisementBlockerHandler", () => {
	before(() => {
		env = process.env;
		process.env.DISCORD_TOKEN = "MY_DISCORD_TOKEN";
	});

	after(() => {
		process.env = env;
	});

	describe("Constructor()", () => {
		it("Creates a handler for MESSAGE_CREATE", () => {
			const handler = new AdvertisementBlockerHandler();

			expect(handler.getEvent()).to.equal(Discord.Constants.Events.MESSAGE_CREATE);
		});
	});

	describe("handle()", () => {
		let sandbox: SinonSandbox;

		beforeEach(() => {
			sandbox = createSandbox();
		});

		it("New member with member role tracked, one message, no repercussions", () => {
			const handler = new AdvertisementBlockerHandler();

			const adminServiceKickMock = sandbox.stub(handler["adminService"], "kickUser");
			const adminServiceDeleteMessageMock = sandbox.stub(handler["adminService"], "deleteMessage");

			// @ts-ignore
			const message: Discord.Message = {
				id: "messageid123",
				content: "Some content",
				channelId: "channelid123",
				member: MEMBER_SHOULD_TRACK
			};

			handler.handle(message);

			expect(handler["trackedUsers"]["map"].size).to.equal(1);

			const actualTrackedMessage = handler["trackedUsers"]["map"]
				?.get("memberid123")	// User map lookup
				?.get(-991697555);		// Message hash lookup

			// @ts-ignore
			expect(actualTrackedMessage?.uniqueChannelIds).to.deep.equal(["channelid123"]);
			// @ts-ignore
			expect(actualTrackedMessage?.messages).to.deep.equal([{channelId: "channelid123", messageId: "messageid123"}]);
			expect(adminServiceKickMock.notCalled).to.be.true;
			expect(adminServiceDeleteMessageMock.notCalled).to.be.true;
		});

		it("New member with member role tracked, multiple messages, no repercussions", () => {
			const handler = new AdvertisementBlockerHandler();

			const adminServiceKickMock = sandbox.stub(handler["adminService"], "kickUser");
			const adminServiceDeleteMessageMock = sandbox.stub(handler["adminService"], "deleteMessage");

			[
				{messageId: "messageid123", content: "Some content", channelId: "channelA"},
				{messageId: "messageid234", content: "Some content2", channelId: "channelB"},
				{messageId: "messageid345", content: "Some content3", channelId: "channelC"}
			].forEach(messageData => {
				// @ts-ignore
				const message: Discord.Message = {
					id: messageData.messageId,
					content: messageData.content,
					channelId: messageData.channelId,
					member: MEMBER_SHOULD_TRACK
				};

				handler.handle(message);
			});

			expect(handler["trackedUsers"]["map"].size).to.equal(1);

			const actualTrackedMessage = handler["trackedUsers"]["map"]
				?.get("memberid123")	// User map lookup
				?.get(-991697555);		// Message hash lookup

			// @ts-ignore
			expect(actualTrackedMessage?.uniqueChannelIds).to.deep.equal(["channelA"]);
			// @ts-ignore
			expect(actualTrackedMessage?.messages).to.deep.equal([
				{channelId: "channelA", messageId: "messageid123"}
			]);
			expect(adminServiceKickMock.notCalled).to.be.true;
			expect(adminServiceDeleteMessageMock.notCalled).to.be.true;
		});

		it("New member with member role tracked, multiple messages, with repercussions", async () => {
			const handler = new AdvertisementBlockerHandler();

			const adminServiceKickMock = sandbox.stub(handler["adminService"], "kickUser");
			const adminServiceDeleteMessageMock = sandbox.stub(handler["adminService"], "deleteMessage");

			const messagesData = [
				{messageId: "messageidA", content: "Some content", channelId: "channelA"},
				{messageId: "messageidB", content: "Some content", channelId: "channelB"},
				{messageId: "messageidC", content: "Some content", channelId: "channelC"}
			];

			// @ts-ignore
			let message: Discord.Message = {};

			for (const messageData of messagesData) {
				// @ts-ignore
				message = {
					id: messageData.messageId,
					content: messageData.content,
					channelId: messageData.channelId,
					member: MEMBER_SHOULD_TRACK
				};

				await handler.handle(message);
			}

			expect(handler["trackedUsers"]["map"].size).to.equal(0);
			expect(adminServiceKickMock.calledOnce);
			expect(adminServiceKickMock.calledWithMatch(
				MEMBER_SHOULD_TRACK,
				"Spamming advertisements in multiple channels",
				"ADVERTISEMENT",
				message
			)).to.be.true;
			expect(adminServiceDeleteMessageMock.calledWithMatch("channelA", "messageidA")).to.be.true;
			expect(adminServiceDeleteMessageMock.calledWithMatch("channelB", "messageidB")).to.be.true;
			expect(adminServiceDeleteMessageMock.calledWithMatch("channelC", "messageidC")).to.be.true;
		});

		it("Old member should not be tracked", () => {
			const handler = new AdvertisementBlockerHandler();

			const adminServiceKickMock = sandbox.stub(handler["adminService"], "kickUser");
			const adminServiceDeleteMessageMock = sandbox.stub(handler["adminService"], "deleteMessage");

			// @ts-ignore
			const message: Discord.Message = {
				id: "messageid123",
				content: "Some content",
				channelId: "channelid123",
				member: MEMBER_TOO_OLD
			};

			handler.handle(message);

			expect(handler["trackedUsers"]["map"].size).to.equal(0);
			expect(adminServiceKickMock.notCalled).to.be.true;
			expect(adminServiceDeleteMessageMock.notCalled).to.be.true;
		});

		it("Members should stop being tracked if too old or promoted", async () => {
			const handler = new AdvertisementBlockerHandler();

			const adminServiceKickMock = sandbox.stub(handler["adminService"], "kickUser");
			const adminServiceDeleteMessageMock = sandbox.stub(handler["adminService"], "deleteMessage");

			const membersData = [
				{member: MEMBER_SHOULD_TRACK, expectedTrackSize: 1},
				{member: MEMBER_TOO_OLD, expectedTrackSize: 0},
				{member: MEMBER_SHOULD_TRACK, expectedTrackSize: 1},
				{member: MEMBER_NOT_ONLY_MEMBER_ROLE, expectedTrackSize: 0}
			];

			for (const memberData of membersData) {
				// @ts-ignore
				const message: Discord.Message = {
					id: "messageid123",
					content: "Some content",
					channelId: "channelid123",
					member: memberData.member
				};

				await handler.handle(message);

				expect(handler["trackedUsers"]["map"].size).to.equal(memberData.expectedTrackSize);
			}

			expect(adminServiceKickMock.notCalled).to.be.true;
			expect(adminServiceDeleteMessageMock.notCalled).to.be.true;
		});

		it("Member with several roles should not be tracked", () => {
			const handler = new AdvertisementBlockerHandler();

			const adminServiceKickMock = sandbox.stub(handler["adminService"], "kickUser");
			const adminServiceDeleteMessageMock = sandbox.stub(handler["adminService"], "deleteMessage");

			// @ts-ignore
			const message: Discord.Message = {
				id: "messageid123",
				content: "Some content",
				channelId: "channelid123",
				member: MEMBER_NOT_ONLY_MEMBER_ROLE
			};

			handler.handle(message);

			expect(handler["trackedUsers"]["map"].size).to.equal(0);
			expect(adminServiceKickMock.notCalled).to.be.true;
			expect(adminServiceDeleteMessageMock.notCalled).to.be.true;
		});

		it("Member without Member role should not be tracked", () => {
			const handler = new AdvertisementBlockerHandler();

			const adminServiceKickMock = sandbox.stub(handler["adminService"], "kickUser");
			const adminServiceDeleteMessageMock = sandbox.stub(handler["adminService"], "deleteMessage");

			// @ts-ignore
			const message: Discord.Message = {
				id: "messageid123",
				content: "Some content",
				channelId: "channelid123",
				member: MEMBER_NO_MEMBER_ROLE
			};

			handler.handle(message);

			expect(handler["trackedUsers"]["map"].size).to.equal(0);
			expect(adminServiceKickMock.notCalled).to.be.true;
			expect(adminServiceDeleteMessageMock.notCalled).to.be.true;
		});
	});
});
