import { db } from "@/database";
import { Command, Component } from "@/discord/base";
import { reply } from "@/functions";
import { settings } from "@/settings";
import { brBuilder, createRow, hexToRgb } from "@magicyan/discord";
import {
  ActionRow,
  ApplicationCommandType,
  Attachment,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  MessageActionRowComponentBuilder,
  StringSelectMenuBuilder,
  formatEmoji,
} from "discord.js";

new Command({
  name: "configuração",
  description: "Comando de configuração do sistema",
  dmPermission,
  defaultMemberPermissions: ["Administrator", "ManageGuild"],
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    await interaction.deferReply({ ephemeral });

    const embed = new EmbedBuilder({
      title: "Configurações do Sistema",
      color: hexToRgb(settings.colors.theme.primary),
      description: brBuilder("> 🌎 Globais", "> ", "> 👮‍♂️ Staff"),
    });

    const buttons = createRow(
      new ButtonBuilder({
        customId: "config-global-button",
        label: "Globais",
        emoji: "🌎",
        style: ButtonStyle.Success,
      }),
      new ButtonBuilder({
        customId: "config-staff-button",
        label: "Staff",
        emoji: "👮‍♂️",
        style: ButtonStyle.Success,
      }),
      new ButtonBuilder({
        customId: "config-close-button",
        label: "Fechar",
        emoji: settings.emoji.static.cancel,
        style: ButtonStyle.Danger,
      })
    );

    await interaction.editReply({ embeds: [embed], components: [buttons] });
  },
});

new Component({
  customId: "config-close-button",
  type: "Button",
  cache: "cached",
  async run(interaction) {
    reply.danger({
      interaction,
      update: true,
      clear: true,
      text: "As configurações do sistema foi fechada!",
    });
  },
});

new Component({
  customId: "config-home-button",
  type: "Button",
  cache: "cached",
  async run(interaction) {
    const embed = new EmbedBuilder({
      title: "Configurações do Sistema",
      color: hexToRgb(settings.colors.theme.primary),

      description: brBuilder("> 🌎 Globais", "> ", "> 👮‍♂️ Staff"),
    });

    const buttons = createRow(
      new ButtonBuilder({
        customId: "config-global-button",
        label: "Globais",
        emoji: "🌎",
        style: ButtonStyle.Success,
      }),
      new ButtonBuilder({
        customId: "config-staff-button",
        label: "Staff",
        emoji: "👮‍♂️",
        style: ButtonStyle.Success,
      }),
      new ButtonBuilder({
        customId: "config-close-button",
        label: "Fechar",
        emoji: settings.emoji.static.cancel,
        style: ButtonStyle.Danger,
      })
    );

    await interaction.update({ embeds: [embed], components: [buttons] });
  },
});

new Component({
  customId: "config-global-button",
  type: "Button",
  cache: "cached",
  async run(interaction) {
    const embed = new EmbedBuilder({
      title: "Configurações Globais do Sistems",
      color: hexToRgb(settings.colors.theme.primary),
      description: brBuilder("> Canais", "> Cargos", "> "),
    });

    const select = createRow(
      new StringSelectMenuBuilder({
        customId: "config-globais-selects",
        placeholder: "Selecione uma opção",
        options: [
          {
            label: "Canais",
            value: "channels",
            description: "Configurações de Canais",
          },
          {
            label: "Cargos",
            value: "roles",
            description: "configuração de cargos",
          },
        ],
      })
    );

    const buttons = createRow(
      new ButtonBuilder({
        customId: "config-home-button",
        label: "Voltar",
        emoji: "⬅️",
        style: ButtonStyle.Primary,
      }),
      new ButtonBuilder({
        customId: "config-close-button",
        label: "Fechar",
        emoji: settings.emoji.static.cancel,
        style: ButtonStyle.Danger,
      })
    );

    await interaction.update({
      embeds: [embed],
      components: [select, buttons],
    });
  },
});

new Component({
  customId: "config-globais-selects",
  type: "StringSelect",
  cache: "cached",
  async run(interaction) {
    const { values, guild,} = interaction;

    

    const buttons = createRow(
      new ButtonBuilder({
        customId: "config-global-button",
        label: "Voltar",
        emoji: "⬅️",
        style: ButtonStyle.Primary,
      }),
      new ButtonBuilder({
        customId: "config-close-button",
        label: "Fechar",
        emoji: settings.emoji.static.cancel,
        style: ButtonStyle.Danger,
      })
    );

    switch (values[0]) {
      case "channels": {
        const currentData = await db.get(db.guilds, guild.id);

        const embed = new EmbedBuilder({
            title: "Configurações de canais",
      color: hexToRgb(settings.colors.theme.primary),
            description: brBuilder(
                "> Entra",
                "> Saida",
                "> ",
                "> Voice"
            )
            });

        const select = createRow(
            new StringSelectMenuBuilder({
                customId: "config-global-channels-select",
                placeholder: "Selecione uma opção",
                options: [
                    { label: "Entra", value: "join", description: "Configurações de bem-vindo" },
                    { label: "Saida", value: "leave", description: "Configurações de despedida" },
                    { label: "Voice", value: "voice", description: "Configurações de canais de vois" }
                ]
            })
        );

        await interaction.update({ embeds: [embed], components: [select, buttons] });
        return;
      }
      case "roles": {

        const embed = new EmbedBuilder({
            title: "Configurações de cargos",
            color: hexToRgb(settings.colors.theme.primary),
            description: (
                "> "
            )
        });

        await interaction.update({ embeds: [embed], components: [ buttons]});
        return;
      }
    }
  },
});


