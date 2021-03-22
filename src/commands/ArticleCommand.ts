import { Message, MessageEmbed } from "discord.js";
import Command from "../abstracts/Command";
import { EMBED_COLOURS } from "../config.json";
import ArticleService from "../services/ArticleService";
import {CodeSupportArticle} from "../interfaces/CodeSupportArticle";

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

			latestArticles.forEach((article: CodeSupportArticle) => {
				const articleUrl = Articles.buildArticleURL(article);
				const profileUrl = Articles.buildProfileURL(article.createdBy);

				embed.addField(article.title, `${article.revision.description} \n[Read Article](${articleUrl}) - Written by [${article.createdBy.alias}](${profileUrl})`);
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