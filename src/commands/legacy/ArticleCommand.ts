import {ColorResolvable, Message, MessageEmbed} from "discord.js";
import Command from "../../abstracts/Command";
import { EMBED_COLOURS } from "../../config.json";
import ArticleService from "../../services/ArticleService";
import CodeSupportArticle from "../../interfaces/CodeSupportArticle";
import WebsiteUserService from "../../services/WebsiteUserService";

class ArticleCommand extends Command {
	constructor() {
		super(
			"article",
			"Shows the latest CodeSupport articles",
			{
				aliases: ["articles"]
			},
		);
	}

	async run(message: Message, args: string[]) {
		const embed = new MessageEmbed();

		try {
			const articleService = ArticleService.getInstance();
			const websiteUserService = WebsiteUserService.getInstance();
			const latestArticles = await articleService.getLatest(5);

			embed.setTitle("Latest CodeSupport Articles");
			embed.setDescription("[View all Articles](https://codesupport.dev/articles)");

			latestArticles.forEach((article: CodeSupportArticle) => {
				const articleUrl = articleService.buildArticleURL(article.titleId);
				const profileUrl = websiteUserService.buildProfileURL(article.createdBy.alias);

				embed.addField(article.title, `${article.revision.description} \n[Read Article](${articleUrl}) - Written by [${article.createdBy.alias}](${profileUrl})`);
			});

			embed.setColor(<ColorResolvable>EMBED_COLOURS.SUCCESS);
		} catch (error) {
			embed.setTitle("Error");
			embed.setDescription("There was a problem with requesting the articles API.");
			embed.setColor(<ColorResolvable>EMBED_COLOURS.ERROR);
		}

		await message.channel.send({ embeds: [embed] });
	}
}

export default ArticleCommand;