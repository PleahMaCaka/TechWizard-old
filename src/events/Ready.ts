import { ArgsOf, Client, Discord, Once } from "discordx";
import "dotenv/config"

@Discord()
export class InteractionHandler {

    @Once({ event: "ready" })
    async onceReady(
        [event]: ArgsOf<"ready">,
        client: Client
    ) {
        await client.guilds.fetch()
        await client.initApplicationCommands()

        const admin = client.users.cache.get(process.env.ADMIN_ID!!)

        if (admin) await admin.send(`Ready!`)
        else console.log("Cannot find admin from users cache (ADMIN_ID)")

        console.log("Ready!")
    }

}