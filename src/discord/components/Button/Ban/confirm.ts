import { Component } from "@/discord/base";
import { getBanOptions } from "@/discord/commands/Private/ban";
import { settings } from "@/settings";
import { hexToRgb } from "@magicyan/discord";
import { EmbedBuilder } from "discord.js";

new Component({
  customId: "confirmBan",
  type: "Button",
  cache: "cached",
  async run(interaction) {
    const { guild, member } = interaction;
    const banOptions = getBanOptions();

    if (banOptions) {
      const { reason, user: userToBan } = banOptions;

      if (
        userToBan.roles.highest.comparePositionTo(
          guild.roles.highest || null
        ) <= 0
      ) {
        await interaction.update({
          content:
            "Eu não posso banir este usuário porque ele possui um cargo igual ou superior ao meu.",
          components: [],
          embeds: [],
        });
        return;
      }
      if (
        userToBan.roles.highest.comparePositionTo(
          member.roles.highest || null
        ) <= 0
      ) {
        await interaction.update({
          content:
            "Você não pode banir este usuário porque ele possui um cargo igual ou superior ao seu.",
          components: [],
          embeds: [],
        });
        return;
      }

      try {
        userToBan.ban({ reason: reason });

        await interaction.update({
          embeds: [
            new EmbedBuilder({
              description: "Usuário banido com sucesso!",
              color: hexToRgb(settings.colors.theme.success)
            })
          ],
          components: [],
        });
      } catch (error) {
        await interaction.update({
          content: "Ocorreu um erro ao tentar banir o usuário",
          components: [],
        });
      }
    }
  },
});
