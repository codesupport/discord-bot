import {Constants, GuildChannel, Invite, TextChannel} from "discord.js";
import { MAX_INVITE_USAGE} from "../../config.json";

import EventHandler from "../../abstracts/EventHandler";

class InviteCycleHandler extends EventHandler {
	constructor() {
		super(Constants.Events.INVITE_DELETE);
	}

	async handle(invite: Invite): Promise<void> {
		const guildChannel = await invite.channel as GuildChannel;

		const createdInvite = await guildChannel.createInvite({
			maxUses: MAX_INVITE_USAGE,
			maxAge: 0,
			unique: true
		});

		const inviteChannel = await invite.guild?.channels.cache.find(channel => channel.id === createdInvite.channel.id) as TextChannel;

		const messages = await inviteChannel.messages.fetch();

		const firstMessage = messages.first();

		if (firstMessage?.author.id === createdInvite.inviter?.id) {
		firstMessage?.edit(createdInvite.toString());
		return;
		}

		await inviteChannel.send(createdInvite.toString());
	}
}

export default InviteCycleHandler;
