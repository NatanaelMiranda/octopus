import { Event } from "@/discord/base";
import { LogCommand } from "@/functions/systems/command";

new Event({
  name: "interactionCreate",
  async run(interaction) {
  LogCommand(interaction);  
  },
});
