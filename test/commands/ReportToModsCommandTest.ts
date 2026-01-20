import { expect } from "chai";
import { createSandbox, SinonSandbox } from "sinon";
import ReportToMods from "../../src/commands/ReportToModsCommand";
import { ChannelType } from "discord.js";

describe("ReportToMods", () => {
	let sandbox: SinonSandbox;
	let command: ReportToMods;
	let getConfigStub: sinon.SinonStub;

	beforeEach(() => {
		sandbox = createSandbox();
		command = new ReportToMods();

		// ✅ SINGLE stub for getConfigValue
		getConfigStub = sandbox.stub(
			require("../../src/utils/getConfigValue"),
			"default"
		);
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe("onContext()", () => {
		it("sends a role ping, an embed to the log channel, and replies ephemerally", async () => {
        	const sendStub = sandbox.stub().resolves();
        	const replyStub = sandbox.stub().resolves();

        	getConfigStub.withArgs("LOG_CHANNEL_ID").returns("LOG_CHANNEL_ID");
        	getConfigStub.withArgs("MOD_ROLE").returns("MOD_ROLE_ID");
        	getConfigStub.withArgs("EMBED_COLOURS").returns({ DEFAULT: "#ffffff" });

        	const interaction: any = {
        		targetMessage: {
        			id: "456",
        			channelId: "123",
        			guildId: "789",
        			content: "Test *message*",
        			author: { id: "111" }
        		},
        		client: {
        			channels: {
        				fetch: sandbox.stub().resolves({
        					type: ChannelType.GuildText,
        					send: sendStub
        				})
        			}
        		},
        		reply: replyStub
        	};
        
        	await command.onContext(interaction);
        
        	// 🔹 send called twice now
        	expect(sendStub.callCount).to.equal(2);
        
        	// 🔹 first call = role ping
        	expect(sendStub.getCall(0).args[0]).to.equal("<@MOD_ROLE_ID>");
        
        	// 🔹 second call = embed payload
        	const embed = sendStub.getCall(1).args[0].embeds[0];
        	expect(embed.data.title).to.equal("Message flagged to moderators");
        	expect(embed.data.description).to.equal("Test \\*message\\*");
        
        	expect(replyStub.calledOnce).to.be.true;
        });

		it("returns early if log channel is invalid", async () => {
        	getConfigStub.withArgs("LOG_CHANNEL_ID").returns("LOG_CHANNEL_ID");
        	getConfigStub.withArgs("MOD_ROLE").returns("MOD_ROLE_ID");
        	getConfigStub.withArgs("EMBED_COLOURS").returns({ DEFAULT: "#ffffff" });
                
        	const fetchStub = sandbox.stub().resolves(null);
                
        	const interaction: any = {
        		targetMessage: {},
        		client: {
        			channels: {
        				fetch: fetchStub
        			}
        		},
        		reply: sandbox.stub()
        	};
        
        	await command.onContext(interaction);
        
        	expect(fetchStub.calledOnce).to.be.true;
        	expect(interaction.reply.called).to.be.false;
        });
	});

	describe("onButton()", () => {
		it("rejects users without the mod role", async () => {
			getConfigStub.withArgs("MOD_ROLE").returns("MOD_ROLE_ID");

			const replyStub = sandbox.stub().resolves();

			const interaction: any = {
				customId: "report:approve:123:456",
				user: { id: "999" },
				member: {
					roles: {
						cache: new Map()
					}
				},
				reply: replyStub
			};

			await command.onButton(interaction);

			expect(replyStub.calledOnce).to.be.true;
			expect(replyStub.getCall(0).args[0].ephemeral).to.be.true;
		});

		it("deletes the message when approved by a mod", async () => {
			getConfigStub.withArgs("MOD_ROLE").returns("MOD_ROLE_ID");

			const deleteStub = sandbox.stub().resolves();
			const fetchMessageStub = sandbox.stub().resolves({ delete: deleteStub });
			const updateStub = sandbox.stub().resolves();

			const interaction: any = {
				customId: "report:approve:123:456",
				user: { id: "999" },
				member: {
					roles: {
						cache: new Map([["MOD_ROLE_ID", true]])
					}
				},
				client: {
					channels: {
						fetch: sandbox.stub().resolves({
							isTextBased: () => true,
							messages: {
								fetch: fetchMessageStub
							}
						})
					}
				},
				update: updateStub
			};

			await command.onButton(interaction);

			expect(fetchMessageStub.calledOnceWith("456")).to.be.true;
			expect(deleteStub.calledOnce).to.be.true;
			expect(updateStub.calledOnce).to.be.true;
		});

		it("does not delete the message when rejected", async () => {
			getConfigStub.withArgs("MOD_ROLE").returns("MOD_ROLE_ID");

			const updateStub = sandbox.stub().resolves();

			const interaction: any = {
				customId: "report:reject:123:456",
				user: { id: "999" },
				member: {
					roles: {
						cache: new Map([["MOD_ROLE_ID", true]])
					}
				},
				update: updateStub
			};

			await command.onButton(interaction);

			expect(updateStub.calledOnce).to.be.true;
		});
	});
});
