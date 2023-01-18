import { dirname, importx } from "@discordx/importer";
import { Client } from "discordx";
import "dotenv/config"
import * as process from "process";
import { ALL_INTENTS } from "./utils/ALL_INTENTS.js";


export const client = new Client({
    intents: ALL_INTENTS,
    silent: (!process.env.DEBUG),
})

async function run() {
    await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`)

    if (process.env.TOKEN) await client.login(process.env.TOKEN)
    else throw new Error("TOKEN is not provided")
}

await run()
