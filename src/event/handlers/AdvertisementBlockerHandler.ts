import {Constants, GuildMember, Message} from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import {ADVERTISEMENT_BLOCKER, MEMBER_ROLE} from "../../config.json";
import {AdminService} from "../../services/AdminService";

/**
 * Checks if the member joined recently, as defined by given hours.
 *
 * @param member 	The {@link GuildMember} to check.
 * @param hours		The number of hours to compare against.
 *
 * @returns boolean Returns true if the user joined in less than the given hours, false otherwise.
 */
function joinedWithin(member: GuildMember, hours: number): boolean {
	return member.joinedTimestamp === null || member.joinedTimestamp > (new Date().getTime() - (hours * 60 * 60 * 1000));
}

/**
 * Helper function to hash a message for later comparison/tracking.
 *
 * @param message The discord message to hash.
 *
 * @returns number The hashed value of the discord message contents.
 */
function hashMessage(message: Message): number {
	const messageString: string = message.content;
	let hash: number = 0;

	if (messageString.length > 0) {
		for (let i = 0; i < messageString.length; ++i) {
			const char: number = messageString.charCodeAt(i);

			hash = (hash << 5) - hash + char;
			hash = hash & hash;
		}
	}

	return hash;
}

/**
 * Interface to define a single copy of a {@link TrackedMessage}
 */
interface MessageTemplate {
	channelId: string,
	messageId: string
}

/**
 * Helper class to track copies of a particular message across multiple channels
 */
class TrackedMessage {
	private uniqueChannelIds: string[] = [];
	private messages: MessageTemplate[] = [];

	addMessage = (messageId: string, channelId: string): void => {
		if (this.uniqueChannelIds.find(c => c === channelId) === undefined) {
			this.uniqueChannelIds.push(channelId);
		}

		this.messages.push({channelId, messageId});
	}

	getMessages = (): MessageTemplate[] => {
		return this.messages;
	}

	channelCount = (): number => {
		return this.uniqueChannelIds.length;
	}
}

/**
 * Helper class to track messages per member id.
 */
class TrackedUsers {
	private map: Map<string, Map<number, TrackedMessage>> = new Map();

	/**
	 * Adds a new entry for the given message from the given discord id.
	 *
	 * If the user has no previous data, it creates a new map entry for the user.
	 * If the message content is unique to previously seen ones, it creates a new {@link TrackedMessage} entry.
	 *
	 * @param discordId The discord ID of the sending user.
	 * @param message	The discord message that was sent.
	 *
	 * @returns TrackedMessage A reference to the {@link TrackedMessage} associated to the given discord message.
	 */
	addUserMessage = (discordId: string, message: Message): TrackedMessage => {
		const messageHash: number = hashMessage(message);

		if (!this.map.has(discordId)) {
			this.map.set(discordId, new Map());
		}

		// It won't be undefined, we just made sure above.
		// @ts-ignore
		const userMessages: Map<number, TrackedMessage> = this.map.get(discordId);

		if (!userMessages.has(messageHash)) {
			userMessages.set(messageHash, new TrackedMessage());
		}

		// It won't be undefined, we just made sure above.
		// @ts-ignore
		const trackedMessage: TrackedMessage = userMessages.get(messageHash);

		trackedMessage.addMessage(message.id, message.channelId);

		return trackedMessage;
	}

	hasUser = (discordId: string): boolean => {
		return this.map.has(discordId);
	}

	removeUser = (discordId: string): void => {
		this.map.delete(discordId);
	}
}

/**
 * Detects potential advertisements, removing them and the user.
 *
 * Uses the following criteria:
 *   - User is new to the server (less than T [configurable] hours)
 *   - User posts the same message in X (configured) channels.
 *
 * Messages are hashed and stored for later comparison, removing them from the tracked messages when the user
 * has stayed for more than T (configurable) hours.
 */
class AdvertisementBlockerHandler extends EventHandler {

	private trackedUsers: TrackedUsers;
	private adminService: AdminService;

	constructor() {
		super(Constants.Events.MESSAGE_CREATE);
		this.trackedUsers = new TrackedUsers();
		this.adminService = new AdminService();
		this.adminService.init();
	}

	/**
	 * Primary handler execution.
	 *
	 * Checks if the user account is new, storing messages if it is, or deleting any existing ones if it isn't.
	 *
	 * @param message The message received from the discord event.
	 */
	handle = async (message: Message): Promise<void> => {
		if (message.member !== null && this.isOnlyMemberRole(message.member)) {
			const member: GuildMember = message.member;
			const memberId: string = member.id;
			const isNewMember = joinedWithin(member, ADVERTISEMENT_BLOCKER.USER_JOINED_WITHIN_HOURS);

			if (isNewMember || this.trackedUsers.hasUser(memberId)) {
				if (isNewMember) {
					const trackedMessage = this.trackedUsers.addUserMessage(memberId, message);

					if (trackedMessage.channelCount() >= ADVERTISEMENT_BLOCKER.CHANNEL_POST_THRESHOLD) {
						await this.adminService.kickUser(member, "Spamming advertisements in multiple channels", "ADVERTISEMENT", message);
						await this.cleanUpMessages(trackedMessage);
						this.trackedUsers.removeUser(memberId);
					}
				} else {
					this.trackedUsers.removeUser(memberId);
				}
			}
		} else {
			// How would this happen?
		}
	}

	/**
	 * Delete the suspected advertisement.
	 *
	 * Only deletes the messages that were posted in multiple channels (more than the threshold).
	 *
	 * @param trackedMessage The {@link TrackedMessage} associated with the suspected advertisement.
	 */
	async cleanUpMessages(trackedMessage: TrackedMessage): Promise<void> {
		const messagesToDelete: MessageTemplate[] = trackedMessage.getMessages();

		for (const message of messagesToDelete) {
			await this.adminService.deleteMessage(message.channelId, message.messageId);
		}
	}

	isOnlyMemberRole(member: GuildMember): boolean {
		return member.roles.cache.size == 2
			&& member.roles.cache.some(role => role.id === MEMBER_ROLE);
	}
}

export default AdvertisementBlockerHandler;
