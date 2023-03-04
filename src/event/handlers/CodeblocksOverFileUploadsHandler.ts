import {Constants, EmbedBuilder, Message, ColorResolvable} from "discord.js";
import EventHandler from "../../abstracts/EventHandler";
import getConfigValue from "../../utils/getConfigValue";
import GenericObject from "../../interfaces/GenericObject";

class CodeblocksOverFileUploadsHandler extends EventHandler {
	constructor() {
		super(Constants.Events.MESSAGE_CREATE);
	}

	async handle(message: Message): Promise<void> {
		if (getConfigValue<string[]>("EXEMPT_CHANNELS_FILE_RESTRICTIONS").includes(message.channelId)) return;

		let invalidFileFlag = false;
		let invalidFileExtension: string = "";

		if (message.attachments.size > 0) {
			message.attachments.forEach(attachment => {
				const fileExtension = attachment.name?.split(".").pop()!.toLowerCase() || "";

				if (!getConfigValue<string[]>("ALLOWED_FILE_EXTENSIONS").includes(fileExtension) || fileExtension === "") {
					invalidFileExtension = fileExtension;
					invalidFileFlag = true;
				}
			});

			if (invalidFileFlag) {
				const embed = new EmbedBuilder();

				embed.setTitle("Uploading Files");
				embed.setDescription(`${message.author}, you tried to upload a \`.${invalidFileExtension}\` file, which is not allowed. Please use codeblocks over attachments when sending code.`);
				embed.setFooter({ text: "Type /codeblock for more information." });
				embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").DEFAULT);

				await message.channel.send({ embeds: [embed] });
				await message.delete();
			}
		}
	}
}

export default CodeblocksOverFileUploadsHandler;
