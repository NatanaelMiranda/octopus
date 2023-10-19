import { db } from "@/database";
import { Event } from "@/discord/base";
import { time } from "discord.js";

new Event({
  name: "interactionCreate",
  async run(interaction) {
    if (!interaction.inCachedGuild()) return;
    const { guild } = interaction;

    const action = await db.get(db.guilds, guild.id);

    const actionLog = action?.logs?.commandLog == "true" ? "true" : "false";

    if (actionLog == "false") return;

      if (interaction.isCommand()) {

        const logsChannel = interaction.guild.channels.cache.get(
          action?.logs?.channel || ""
        );
        if (!logsChannel?.isTextBased()) return;

        const { channel, user, commandName, createdAt, commandType } =
          interaction;
        const emoji = ["⌨️", "👨‍🦱", "✉️"];
        const text = [
          "usou o comando",
          "usou o contexto de usuário",
          "usou o contexto de mensagem",
        ];

        let content = `${emoji[commandType - 1]} ${time(createdAt, "R")}`;
        content += `**@${user.username}** `;
        content += `__${text[commandType - 1]}__ `;
        content += `\`${commandName}\` `;
        if (channel) content += `em ${channel.url}`;

        logsChannel.send({ content });

        return;
      }    
  },
});
