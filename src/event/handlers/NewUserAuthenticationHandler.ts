import { Events, MessageReaction, RoleResolvable, User } from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import getConfigValue from "../../utils/getConfigValue";
import { logger } from "../../logger";

class NewUserAuthenticationHandler extends EventHandler {
	constructor() {
		super(Events.MessageReactionAdd);
	}

	async handle(reaction: MessageReaction, member: User): Promise<void> {
		const { message, emoji } = reaction;
		const isAuthMessage = message.id === getConfigValue<string>("AUTHENTICATION_MESSAGE_ID");
		const isAuthEmoji = emoji.name === "🤖";

		if (isAuthMessage && isAuthEmoji) {
			const guildMember = await reaction.message.guild?.members.fetch(member);

			logger.info("User has triggered authentication reaction. Applying member role.", {
				userId: guildMember?.id
			});

			await guildMember?.roles.add(getConfigValue<RoleResolvable>("MEMBER_ROLE"), "User has authenticated their account.");
		}
	}
}

export default NewUserAuthenticationHandler;
