import { ArgsOf, Client, Discord, On } from "discordx";

@Discord()
export class InteractionHandler {

    @On({ event: "interactionCreate" })
    async onInteractionCreate(
        [interaction]: ArgsOf<"interactionCreate">,
        client: Client
    ) {
        try {
            await client.executeInteraction(interaction);
        } catch (e) {
            console.error(e)
        }
    }

}