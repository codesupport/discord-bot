import EventHandler from '../../abstracts/EventHandler';
import { Constants, MessageReaction, User } from 'discord.js';
import { BOTLESS_CHANNELS } from '../../config.json';

class ReactionHiringLookingHandler extends EventHandler {
  constructor() {
    super(Constants.Events.MESSAGE_REACTION_ADD);
  }

  async handle(reaction: MessageReaction, member: User): Promise<void> {
    const { message } = reaction;
    const { channel } = message;

    const isHLChannel = channel.id == BOTLESS_CHANNELS.HIRING_OR_LOOKING;
    const isSelfReact = message.author?.id == member.id
    if (isHLChannel && isSelfReact) {
      reaction.users.remove(member);
    }
  }
}

export default ReactionHiringLookingHandler;
