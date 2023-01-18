import axios from "axios";
import {
    ActionRowBuilder,
    ApplicationCommandType,
    ButtonBuilder,
    ButtonStyle,
    ContextMenuCommandInteraction,
    EmbedBuilder,
    MessageActionRowComponentBuilder
} from "discord.js";
import { ContextMenu, Discord } from "discordx";


type failReason = "NoContent" | "RequestFail" | "unknown";

@Discord()
export class Hastebin {

    @ContextMenu({
        name: "Hastebin",
        type: ApplicationCommandType.Message
    })
    async hastebin(
        interaction: ContextMenuCommandInteraction
    ) {
        await interaction.deferReply()

        const msg = await interaction.channel?.messages.fetch(interaction.targetId).then(msg => msg.content)

        if (!msg) return interaction.editReply({ embeds: [this.failEmbed("NoContent")] })

        // request
        const res = await axios.post("https://hastebin.com/documents/", msg)

        // fail
        if (res.status !== 200)
            return interaction.editReply({ embeds: [this.failEmbed("RequestFail", res.data.status)] })

        // success
        const { guildId, channelId, targetId, user } = interaction

        const embed = new EmbedBuilder()
            .setTitle("업로드 성공!")
            .setDescription(`
					아래 버튼을 눌러 확인하세요. \`${res.data.key}\`
					<@${user.id}> » [저장된 메세지](https://discord.com/channels/${guildId}/${channelId}/${targetId})
				`)
            .setColor("Green")

        const gotoBtn = new ButtonBuilder()
            .setURL(`https://hastebin.com/${res.data.key}`)
            .setStyle(ButtonStyle.Link)
            .setLabel("확인하기")

        const gotoRawBtn = new ButtonBuilder()
            .setURL(`https://hastebin.com/raw/${res.data.key}`)
            .setStyle(ButtonStyle.Link)
            .setLabel("원시 데이터")

        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
            .addComponents(gotoBtn, gotoRawBtn)

        return await interaction.editReply({ embeds: [embed], components: [row] })
    }

    private failEmbed(reason: failReason = "unknown", code?: string) {
        const failEmbed = new EmbedBuilder()
            .setTitle("업로드 실패!")
            .setColor("Red")

        switch (reason) {
            case "NoContent":
                return failEmbed.setDescription("이미지, 임베드는 업로드가 불가능합니다.")
            case "RequestFail":
                return failEmbed.setDescription(`서버가 응답하지 않습니다. 잠시 후 다시 시도해주세요. \`${code}\``)
            default:
                return failEmbed.setDescription(`알 수 없는 이유: \`${code}\``)
        }

    }

}