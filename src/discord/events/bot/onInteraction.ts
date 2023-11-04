import { Event } from "@/discord/base";
import { LogCommand } from "@/functions";

new Event({
  name: "interactionCreate",
  async run(interaction) {
  LogCommand(interaction);  
  },
});
