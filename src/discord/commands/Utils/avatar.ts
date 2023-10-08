import { Command } from "@/discord/base";
import { settings } from "@/settings";
import { hexToRgb } from "@magicyan/discord";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  EmbedBuilder,
} from "discord.js";

new Command({
  name: "avatar",
  description: "Amostra o avatar de um membro",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "usuario",
      description: "Mencione um usuário",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
  ],
  async run(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const { options } = interaction;

    const mention = options.getUser("usuario");

    if (!mention) {
      await interaction.followUp("Usuário não encontrado.");
      return;
    }

    const embed = new EmbedBuilder();

    if (mention.displayAvatarURL()) {
      embed.setTitle(`Avatar de ${mention.username}`);
      embed.setImage(mention.displayAvatarURL({ size: 256 }));
      embed.setColor(hexToRgb(settings.colors.theme.success));
    } else {
      embed.setTitle("Usuário sem avatar");
      embed.setColor(hexToRgb(settings.colors.theme.danger)); 
    }

    await interaction.editReply({ embeds: [embed] });
  },
});
