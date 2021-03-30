import {Constants, Invite, TextChannel} from "discord.js";
import { INVITE } from "../../config.json";

import EventHandler from "../../abstracts/EventHandler";

class InviteCycleHandler extends EventHandler {
	constructor() {
		super(Constants.Events.INVITE_DELETE);
	}

	async handle(invite: Invite): Promise<void> {
		const inviteChannel = invite.guild?.channels.cache.get(INVITE.CHANNEL_ID) as TextChannel;

		const createdInvite = await inviteChannel.createInvite({
			maxUses: INVITE.MAX_USAGE,
			maxAge: 0,
			unique: true
		});

		const message = await inviteChannel.messages.fetch(INVITE.MESSAGE);

		await message.edit(createdInvite.toString());
	}
}

export default InviteCycleHandler;
