import { Command } from "@/discord/base";
import { settings } from "@/settings";
import { brBuilder, hexToRgb } from "@magicyan/discord";
import {
  ApplicationCommandType,
  Client,
  EmbedBuilder,
  GuildMember,
  bold,
  time,
} from "discord.js";

new Command({
  name: "Ver informações",
  dmPermission,
  type: ApplicationCommandType.User,
  async run(interaction) {
    if (!interaction.isContextMenuCommand()) return;

    const { targetMember, client } = interaction;
    const { user, guild, roles } = targetMember;

    const member = guild.members.cache.get(user.id);

    let embedInfoUser = new EmbedBuilder({
      title: user.username,
      author: { name: "Interaction sobre o usuário" },
      thumbnail: { url: user.displayAvatarURL() },
      fields: [
        { name: "🆔 ID do Discord", value: `\`${user.id}\``, inline: true },
        { name: "🏷️ Tag do Discord", value: `\`${user.tag}\``, inline: true },
        {
          name: "📅 Data de Criação da Conta",
          value: await UserCreateDate(user),
          inline: true,
        },
      ],
      color: hexToRgb(settings.colors.theme.primary),
    });

    const highestRole = roles.highest;

    let embedInfoMemberGuild = new EmbedBuilder({
      title: user.displayName,
      author: { name: "Informaçoes sobre o Membro" },
      thumbnail: { url: user.displayAvatarURL() },
      fields: [
        {
          name: "📅 Data de entrada no servidor",
          value: await MemberJoinDate(member),
          inline: true,
        },
        { name: "Maior Cargo", value: highestRole.toString(), inline: true },
      ],
      description: brBuilder(bold("Curiosidades Interessantes"), ""),
      color: hexToRgb(settings.colors.theme.primary),
    });

    if (user.id === client.user.id) {
      const embed3 = new EmbedBuilder({
        author: { name: "Informações sobre aplicativo" },
        title: user.username,

        fields: [
          { name: "🆔 Id do servidor de suporte", value: "\`1166489733224992888\`", inline: true },
          { name:  "🏷️ Marcadores", value: "", inline: true },
          { name: "🐛  Slug", value: `\`${user.displayName}\``, inline: true },
        ],
        description: brBuilder(
          bold("Curiosidades Interesantes"),
          "Público",
          "Requer Código de Autenticação via OAuth2",
          "Usa Interações via HTTP",
          "Intent de Presenças pelo Gateway",
          "Intent de Membro de Servidor",
          "Intent de Conteúdo de Memsagens",
          "",
          bold("💻 Chave Pública de Verificação de Requisições HTTP"),
        ),
        color: hexToRgb(settings.colors.theme.primary),
      });

      interaction.reply({
        ephemeral,
        embeds: [embedInfoUser, embedInfoMemberGuild],
      });

      return;
    }

    if (user.bot) {
      const embedInfoBot = new EmbedBuilder({
        title: user.displayName,
        author: {
          name: "Informações sobre o Aplicativo",
        },
        description: brBuilder(
          bold("Curiosidades Interesantes"),
          "Píbl",

          "",
          bold("💻 Chave Pública de Verificação de Requisições HTTP"),
          
          ),
        thumbnail: { url: "" },
        image: { url: "" },
        color: hexToRgb(settings.colors.theme.primary),
      });

      interaction.reply({
        ephemeral,
        embeds: [embedInfoUser, embedInfoMemberGuild, embedInfoBot],
      });

      return;
    }

    interaction.reply({
      ephemeral,
      embeds: [embedInfoUser, embedInfoMemberGuild],
    });
  },
});

function UserCreateDate(user: any) {
  const userCreatedAt = user.createdAt;
  const currentDate = new Date();
  const diffInYears = currentDate.getFullYear() - userCreatedAt.getFullYear();
  let agoString = "";

  if (diffInYears === 0) {
    const diffInMonths =
      (currentDate.getFullYear() - userCreatedAt.getFullYear()) * 12 +
      (currentDate.getMonth() - userCreatedAt.getMonth());
    agoString =
      diffInMonths > 0
        ? ` (há ${diffInMonths} mês${diffInMonths > 1 ? "es" : ""})`
        : "";
  } else {
    agoString =
      diffInYears > 1
        ? ` (há ${diffInYears} ano${diffInYears > 1 ? "s" : ""})`
        : " (há 1 ano)";
  }

  const formattedDate = userCreatedAt.toLocaleString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  return `${formattedDate}${agoString}`;
}

async function MemberJoinDate(member: any) {
  const memberJoinDate = member.joinedAt;
  const currentDate = new Date();
  const diffInYears = currentDate.getFullYear() - memberJoinDate.getFullYear();
  let agoString = "";

  if (diffInYears === 0) {
    const diffInMonths =
      (currentDate.getFullYear() - memberJoinDate.getFullYear()) * 12 +
      (currentDate.getMonth() - memberJoinDate.getMonth());
    agoString =
      diffInMonths > 0
        ? ` (há ${diffInMonths} mês${diffInMonths > 1 ? "es" : ""})`
        : "";
  } else {
    agoString =
      diffInYears > 1
        ? ` (há ${diffInYears} ano${diffInYears > 1 ? "s" : ""})`
        : " (há 1 ano)";
  }

  const formattedDate = memberJoinDate.toLocaleString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  return `${formattedDate}${agoString}`;
}
