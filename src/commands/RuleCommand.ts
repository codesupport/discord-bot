import {ColorResolvable, CommandInteraction, EmbedBuilder, ApplicationCommandOptionType, User} from "discord.js";
import {Discord, Slash, SlashChoice, SlashOption} from "discordx";
import getConfigValue from "../utils/getConfigValue";
import GenericObject from "../interfaces/GenericObject";

interface Rule {
	name: string;
	triggers: string[];
	description: string;
}

const rules = getConfigValue<Rule[]>("rules").map(it => ({name: it.name, value: it.triggers[0]}));

@Discord()
class RuleCommand {
	private lastPinged = new Map<string, number>();
	private lastPingPerPinger = new Map<string, number>();

	@Slash({ name: "rule", description: "Get info about a rule" })
	async onInteract(
		@SlashChoice(...rules) @SlashOption({ name: "rule", description: "Name of a rule", type: ApplicationCommandOptionType.String, required: true }) ruleName: string,
		@SlashOption({ name: "user", description: "User to ping", type: ApplicationCommandOptionType.User, required: false}) mentionedUser: User | undefined,
			interaction: CommandInteraction): Promise<void> {
		if (interaction === undefined) {
			console.error("Interaction is undefined in RuleCommand");
			return;
		}

		const embed = new EmbedBuilder();

		const rule = getConfigValue<Rule[]>("rules").find(rule => rule.triggers.includes(ruleName));

		const ruleHeader = getConfigValue<Rule[]>("rules")[0] === rule ? "Info" : "Rule";

		if (rule !== undefined) {
			embed.setTitle(`${ruleHeader}: ${rule.name}`);
			embed.setDescription(rule.description);
			embed.addFields([{ name: "To familiarise yourself with all of the server's rules please see", value: "<#240884566519185408>" }]);
			embed.setColor(getConfigValue<GenericObject<ColorResolvable>>("EMBED_COLOURS").SUCCESS);
		}
		await interaction.reply({ embeds: [embed] });

		if (mentionedUser) {
			const userId = mentionedUser.id;
			const now = Date.now();
			const cooldownValue = getConfigValue<number>("RULE_PING_COOLDOWN_PINGED");

			const lastTime = this.lastPinged.get(userId);

			if (lastTime) {
				const secondsPassed = (now - lastTime) / 1000;

				if (secondsPassed < cooldownValue) {
					const remaining = (cooldownValue - secondsPassed).toFixed(0);

					await interaction.followUp({
						content: `Slow down! That user can be pinged again in ${remaining}s.`,
						ephemeral: true
					});
					return;
				}
			}

			// If they passed the check, update the map with the new time
			this.lastPinged.set(userId, now);

			const cooldownValuePinger = getConfigValue<number>("RULE_PING_COOLDOWN_PINGER");

			const lastTimePinger = this.lastPingPerPinger.get(userId);

			if (lastTimePinger) {
				const secondsPassed = (now - lastTimePinger) / 1000;

				if (secondsPassed < cooldownValuePinger) {
					const remaining = (cooldownValuePinger - secondsPassed).toFixed(0);

					await interaction.followUp({
						content: `Slow down! You can ping someone again in ${remaining}s.`,
						ephemeral: true
					});
					return;
				}
			}

			// If they passed the check, update the map with the new time
			this.lastPingPerPinger.set(interaction.user.id, now);

			await interaction.followUp({ content: `<@${mentionedUser?.id}> Please read the rule mentioned above, and take a moment to familiarise yourself with the rules.` });
		}
	}
}

export default RuleCommand;
