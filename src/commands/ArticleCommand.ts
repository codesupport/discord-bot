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
			const latestArticles = await Articles.getLatest(5);

			embed.setTitle("Latest CodeSupport Articles");
			embed.setDescription("[View all Articles](https://codesupport.dev/articles)");

			latestArticles.forEach((article: ArticlePreview) => {
				embed.addField(article.title, `${article.description} \n[Read Article](${article.article_url}) - Written by [${article.author}](${article.author_url})`);
			});

			embed.setColor(EMBED_COLOURS.SUCCESS);
		} catch (error) {
			embed.setTitle("Error");
			embed.setDescription("There was a problem with requesting the articles API.");
			embed.setColor(EMBED_COLOURS.ERROR);
		}

		await message.channel.send({ embed });
	}
}

export default ArticleCommand;