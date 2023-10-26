import { db } from "@/database";
import { Command } from "@/discord/base";
import { settings } from "@/settings";
import { brBuilder, hexToRgb } from "@magicyan/discord";
import { ApplicationCommandType, EmbedBuilder, bold } from "discord.js";

new Command({
  name: "perfil",
  description: "Acesse seu perfil ou de outro usuário",
  dmPermission,
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    const { user, guild, member } = interaction;
    await interaction.deferReply({ ephemeral });

    const action = await db.get(db.users, user.id);

    const ActionDisplay = {
      discordDate: user.createdAt.toLocaleDateString(),
      guildDate: guild.joinedAt.toLocaleDateString(),
      description: action?.perfil?.description,
      avatar: user.displayAvatarURL(),
      color: action?.perfil?.color,
    };

    const defaults = {
      color: settings.colors.theme.magic,
    };

    const embed = new EmbedBuilder({
      title: user.displayName,
      description: brBuilder(
        `> ${bold("Membro desde")}`,
        `> Discord:  \`${ActionDisplay.discordDate}\``,
        `> Guild: \`${ActionDisplay.guildDate}\``,
        "\n",
        `> ${bold("description:")}`,
        `> \`${ActionDisplay.description || bold("Descriçao não inserida!")}\``
      ),
      thumbnail: { url: ActionDisplay.avatar },
      color: hexToRgb(ActionDisplay.color || defaults.color),
    });

    interaction.editReply({ embeds: [embed] });
  },
});
