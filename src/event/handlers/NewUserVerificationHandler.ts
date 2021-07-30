import {Constants, Message} from "discord.js";
import { AUTHENTICATION_MESSAGE_CHANNEL, AUTHENTICATION_MESSAGE_RESPONSE, MEMBER_ROLE } from "../../config.json";
import EventHandler from "../../abstracts/EventHandler";

class NewUserVerificationHandler extends EventHandler {
	constructor() {
		super(Constants.Events.MESSAGE_CREATE);
	}

	async handle(message: Message): Promise<void> {
		if (message.channel.id === AUTHENTICATION_MESSAGE_CHANNEL && message.content === AUTHENTICATION_MESSAGE_RESPONSE) {
			const user = message.member?.user;

			if (user !== undefined) {
				const guildMember = await message.guild?.members.fetch(user);

				await guildMember?.roles.add(MEMBER_ROLE, "User has authenticated their account.");
			}

			await message.delete();
		}
	}
}

export default NewUserVerificationHandler;