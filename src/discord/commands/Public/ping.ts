import { Command } from "@/discord/base";
import { reply } from "@/functions";
import { settings } from "@/settings";
import { hexToRgb } from "@magicyan/core";
import {
  ApplicationCommandType,
  EmbedBuilder,
} from "discord.js";

new Command({
  name: "ping",
  description: "veja o ping do bot!",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    const { user, client } = interaction;

    let name = user.username;
    let ping = client.ws.ping;

    reply.success({
      interaction,
      text: `Olá ${name}, o ping do bot é: \`${ping}ms\``
    });

  },
});
