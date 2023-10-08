import { Command } from "@/discord/base";
import { settings } from "@/settings";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ColorResolvable,
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
    const { member, options } = interaction;

    const mention = options.getUser("usuario");

    
    if (!mention) {
        await interaction.followUp("Usuário não encontrado.");
        return;
      }
  
      const embed = new EmbedBuilder();
  
      // Verifica se o usuário possui um avatar e define o título e a imagem em miniatura do embed
      if (mention.displayAvatarURL()) {
        embed.setTitle(`Avatar de ${mention.username}`);
        embed.setImage(mention.displayAvatarURL({ size: 256 }));
        embed.setColor(settings.colors.theme.success as ColorResolvable);
      } else {
        // Caso o usuário não tenha um avatar, você pode adicionar uma mensagem personalizada
        embed.setTitle("Usuário sem avatar");
        embed.setColor(settings.colors.theme.danger as ColorResolvable); // Cor vermelha para indicar ausência de avatar
      }

    await interaction.editReply({ embeds: [embed] });
  },
});
