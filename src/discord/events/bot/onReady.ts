import { Event } from "@/discord/base";
import { CommandLogsData } from "@/functions";

new Event({
    name: "ready",
    run(client) {
        CommandLogsData(client);
    },
})