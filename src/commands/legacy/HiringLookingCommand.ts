import {ColorResolvable, Message, MessageEmbed} from "discord.js";
import Command from "../../abstracts/Command";
import { EMBED_COLOURS, BOTLESS_CHANNELS } from "../../config.json";

class HiringLookingCommand extends Command {
	constructor() {
		super(
			"hl",
			"Get information on how to correctly format a Hiring/Looking post"
		);
	}

	async run(message: Message): Promise<void> {
		const embed = new MessageEmbed();

		embed.setTitle("Hiring or Looking Posts");
		embed.setDescription(`
			CodeSupport offers a free to use hiring or looking section.\n
			Here you can find people to work for you and offer your services,
			as long as it fits in with the rules. If you get scammed in hiring or looking there is
			nothing we can do, however, we do ask that you let a moderator know.
		`);
		embed.addField("Payment", "If you are trying to hire people for a project, and that project is not open source, your post must state how much you will pay them (or a percentage of profits they will receive).");
		embed.addField("Post Frequency", `Please only post in <#${BOTLESS_CHANNELS.HIRING_OR_LOOKING}> once per week to keep the channel clean and fair. Posting multiple times per week will lead to your access to the channel being revoked.`);
		embed.addField("Example Post", `
			Please use the example below as a template to base your post on.\n
			\`\`\`
[HIRING]
Full Stack Website Developer
We are looking for a developer who is willing to bring our video streaming service to life.
Pay: $20/hour
Requirements:
- Solid knowledge of HTML, CSS and JavaScript
- Knowledge of Node.js, Express and EJS.
- Able to turn Adobe XD design documents into working web pages.
- Able to stick to deadlines and work as a team.
			\`\`\`
		`);
		embed.setColor(<ColorResolvable>EMBED_COLOURS.DEFAULT);

		await message.channel.send({ embeds: [embed] });
	}
}

export default HiringLookingCommand;
