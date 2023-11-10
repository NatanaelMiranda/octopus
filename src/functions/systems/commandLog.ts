import { db } from "@/database";
import { Client, Interaction, time } from "discord.js";

export async function commandLogs(interaction: Interaction) {
  if (!interaction.inCachedGuild()) return;

  const actionData = await db.get(db.guilds, interaction.guild.id);

  const logStatus = actionData?.logs?.commandLogStatus;
  const channelId = actionData?.logs?.channel;

  if (!logStatus) return;

  if (interaction.isCommand()) {
    const logsChannel = interaction.guild.channels.cache.get(channelId || "");
    if (!logsChannel?.isTextBased()) return;

    const { channel, user, commandName, createdAt, commandType } = interaction;
    const emoji = ["⌨️", "🙍‍♂️", "📧"];

    const text = [
      " usou o comando ",
      " usou o contexto de usuário ",
      " usou o contexto de mensagem ",
    ];

    let content = `${emoji[commandType - 1]} ${time(createdAt, "R")}`;
    content += `**${user.username}**`;
    content += `__${text[commandType - 1]}__`;
    content += `\`${commandName}\``;
    if (channel) content += `em ${channel.url}`;

    logsChannel.send({ content });

    return;
  }
}
