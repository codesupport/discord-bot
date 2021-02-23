import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";
import { EMBED_COLOURS } from "../config.json";
import ArticleService from "../services/ArticleService";
import ArticlePreview from "../interfaces/ArticlePreview";

class ArticleCommand extends Command {
	constructor() {
		super(
			"article",
			"Shows the latest CodeSupport articles"
		);
	}

	async run(message: Message, args: string[]) {
		const embed = new MessageEmbed();

			try {
				const Articles = ArticleService.getInstance();
				console.log("Test");
				const latestArticles = await Articles.getLatest();

				console.log("latestArticles");

				embed.setTitle(`Check out our latest articles!`);

				latestArticles.forEach((article: ArticlePreview) => {
						console.log("loopdieloop");
						//embed.addField(article.title, `${article.description} \nWritten by [${article.author}](${article.author_url})`);
					});

					embed.setColor(EMBED_COLOURS.SUCCESS);
				// } else {
				// 	embed.setTitle("No Issues found");
				// 	embed.setDescription(`This repository has no issues. [Create one](${resRep.url}/issues/new)`);
				// 	embed.setColor(EMBED_COLOURS.SUCCESS);
				// }
			} catch (error) {
				console.log(error);
				embed.setTitle("Error");
				embed.setDescription("There was a problem with the request to GitHub.");
				embed.addField("Correct Usage", "?issues <username>/<repository>");
				embed.setColor(EMBED_COLOURS.ERROR);
			}


		await message.channel.send({ embed });
	}
}

export default ArticleCommand;