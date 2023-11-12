import { db } from "@/database";
import { Client, Collection, Interaction, TextChannel, time } from "discord.js";

interface CommandLogsProps {
  logState?: boolean;
  channelId?: string;
}
const Guilds: Collection<string, CommandLogsProps> = new Collection();

export async function CommandLogsData(
  client: Client,
) {
  client.channels.cache.forEach(async (guild) => {
    const actionData = await db.get(db.guilds, guild.id);

    const LogState = actionData?.logs?.commandLogStatus;
    const channel = actionData?.logs?.channel;

    Guilds.set(guild.id, {
      logState: LogState || false,
      channelId: channel || "",
    });
  });
}

export async function commandLogs(interaction: Interaction) {
  if (!interaction.inCachedGuild()) return;

  const GuildsProps = Guilds.get(interaction.guild.id);

  const logState = GuildsProps?.logState;

  if (!logState) {
    const actionData = await db.get(db.guilds, interaction.guild.id);
    
    const LogState = actionData?.logs?.commandLogStatus;
    const channel = actionData?.logs?.channel;

    Guilds.set(interaction.guild.id, {
      logState: LogState || true,
      channelId: channel || ""
    });

  }

  if (!logState) return;

  const channelId = interaction.guild.channels.cache.get(GuildsProps.channelId || "");

  if(!channelId){
    const actionData = await db.get(db.guilds, interaction.guild.id);
    
    const channel = actionData?.logs?.channel;

    Guilds.set(interaction.guild.id, {
      channelId: channel || ""
    });
  }

  if (interaction.isCommand()) {
    const logsChannel = interaction.guild.channels.cache.get(GuildsProps.channelId || "");
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
