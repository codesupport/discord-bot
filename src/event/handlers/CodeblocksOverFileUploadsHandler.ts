import { Constants, MessageEmbed, Message } from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import { ALLOWED_FILE_EXTENSIONS, EMBED_COLOURS } from "../../config.json";

class CodeblocksOverFileUploadsHandler extends EventHandler {
	constructor() {
		super(Constants.Events.MESSAGE_CREATE);
	}

	async handle(message: Message): Promise<void> {
		let invalidFileFlag = false;
		let invalidFileExtension: string = "";

		if (message.attachments.size > 0) {
			message.attachments.forEach(attachment => {
				const fileExtension = attachment.name?.split(".").pop()!.toLowerCase();

				if (!ALLOWED_FILE_EXTENSIONS.includes(fileExtension)) {
					invalidFileExtension = fileExtension;
					invalidFileFlag = true;
				}
			});

			if (invalidFileFlag) {
				const embed = new MessageEmbed();

				embed.setTitle("Uploading Files");
				embed.setDescription(`<@${message.author.id}>, you tried to upload a \`.${invalidFileExtension}\` file, which is not allowed. Please use codeblocks over attachments when sending code.`);
				embed.setFooter("Type ?codeblock for more information.");
				embed.setColor(EMBED_COLOURS.DEFAULT);

				await message.channel.send({ embed });
				if (message.deletable) {
					message.delete();
				}
			}
		}
	}
}

export default CodeblocksOverFileUploadsHandler;