import Discord from "discord.js";

// Shoutout to TotomInc on GitHub for making this, you're a life saver. <3
// It has been slightly modified to work with the latest version of Discord.js.
// https://github.com/discordjs/discord.js/issues/3576#issuecomment-589673184

export default class MockDiscord {
	private client!: Discord.Client;
	private guild!: Discord.Guild;
	private channel!: Discord.Channel;
	private guildChannel!: Discord.GuildChannel;
	private textChannel!: Discord.TextChannel;
	private user!: Discord.User;
	private guildMember!: Discord.GuildMember;
	private message!: Discord.Message;
	private messageReaction!: Discord.MessageReaction;

	constructor() {
		this.mockClient();

		this.mockGuild();

		this.mockChannel();

		this.mockGuildChannel();

		this.mockTextChannel();

		this.mockUser();

		this.mockGuildMember();

		this.mockMessage();

		this.mockMessageReaction();
	}

	public getClient(): Discord.Client {
		return this.client;
	}

	public getGuild(): Discord.Guild {
		return this.guild;
	}

	public getChannel(): Discord.Channel {
		return this.channel;
	}

	public getGuildChannel(): Discord.GuildChannel {
		return this.guildChannel;
	}

	public getTextChannel(): Discord.TextChannel {
		return this.textChannel;
	}

	public getUser(): Discord.User {
		return this.user;
	}

	public getGuildMember(unique?: boolean): Discord.GuildMember {
		return unique ? this.mockUniqueGuildMember() : this.guildMember;
	}

	public getMessage(): Discord.Message {
		return this.message;
	}

	public getMessageReaction(): Discord.MessageReaction {
		return this.messageReaction;
	}

	private mockClient(): void {
		this.client = new Discord.Client();
	}

	private mockGuild(): void {
		this.guild = new Discord.Guild(this.client, {
			unavailable: false,
			id: "guild-id",
			name: "mocked discord.js guild",
			icon: "mocked guild icon url",
			splash: "mocked guild splash url",
			region: "eu-west",
			member_count: 42,
			large: false,
			features: [],
			application_id: "application-id",
			afkTimeout: 1000,
			afk_channel_id: "afk-channel-id",
			system_channel_id: "system-channel-id",
			embed_enabled: true,
			verification_level: 2,
			explicit_content_filter: 3,
			mfa_level: 8,
			joined_at: new Date("2018-01-01").getTime(),
			owner_id: "owner-id",
			channels: [],
			roles: [],
			presences: [],
			voice_states: [],
			emojis: []
		});
	}

	private mockChannel(): void {
		this.channel = new Discord.Channel(this.client, {
			id: "channel-id"
		});
	}

	private mockGuildChannel(): void {
		this.guildChannel = new Discord.GuildChannel(this.guild, {
			...this.channel,

			name: "guild-channel",
			position: 1,
			parent_id: "123456789",
			permission_overwrites: []
		});
	}

	private mockTextChannel(): void {
		this.textChannel = new Discord.TextChannel(this.guild, {
			...this.guildChannel,

			topic: "topic",
			nsfw: false,
			last_message_id: "123456789",
			lastPinTimestamp: new Date("2019-01-01").getTime(),
			rate_limit_per_user: 0
		});
	}

	private mockUser(): void {
		this.user = new Discord.User(this.client, {
			id: "user-id",
			username: "user username",
			discriminator: "user#0000",
			avatar: "user avatar url",
			bot: false
		});
	}

	private mockGuildMember(): void {
		this.guildMember = new Discord.GuildMember(this.client, {
			deaf: false,
			mute: false,
			self_mute: false,
			self_deaf: false,
			session_id: "session-id",
			channel_id: "channel-id",
			nick: "nick",
			joined_at: new Date("2020-01-01").getTime(),
			user: this.user,
			roles: []
		}, this.guild);
	}

	private mockMessage(): void {
		this.message = new Discord.Message(
			this.client,
			{
				id: "message-id",
				type: "DEFAULT",
				content: "this is the message content",
				author: this.user,
				webhook_id: null,
				member: this.guildMember,
				pinned: false,
				tts: false,
				nonce: "nonce",
				embeds: [],
				attachments: [],
				edited_timestamp: null,
				reactions: [],
				mentions: [],
				mention_roles: [],
				mention_everyone: [],
				hit: false
			},
			this.textChannel,
		);
	}

	private mockMessageReaction(): void {
		this.messageReaction = new Discord.MessageReaction(
			this.client,
			{
				message: this.message,
				emoji: {
					name: "emoji-name"
				}
			},
			this.message
		);
	}

	private mockUniqueGuildMember(): Discord.GuildMember {
		return new Discord.GuildMember(this.client, {
			deaf: false,
			mute: false,
			self_mute: false,
			self_deaf: false,
			session_id: "session-id",
			channel_id: "channel-id",
			nick: "nick",
			joined_at: new Date("2020-01-01").getTime(),
			user: this.user,
			roles: []
		}, this.guild);
	}
}