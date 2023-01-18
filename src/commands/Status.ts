import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";

@Discord()
export class Status {

    @Slash({ description: "show status", nameLocalizations: { "en-US": "status", ko: "상태" } })
    async status(
        interaction: CommandInteraction
    ) {
        await interaction.reply("well well well")
    }

}