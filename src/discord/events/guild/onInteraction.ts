import { Event } from "@/discord/base";
import { commandLogs } from "@/functions";

new Event({
  name: "interactionCreate",
  run(interaction) {
    commandLogs(interaction);
  },
});
