import { Command } from "@/discord/base";
import {
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  GuildMember,
  Collection,
} from "discord.js";

new Command({
  name: "ban",
  description: "Banir um usuário com confirmação",
  dmPermission: false,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "user",
      description: "Usuário a ser banido",
      type: ApplicationCommandOptionType.User,
      required: true,
    },
    {
      name: "motivo",
      description: "Motivo do banimento",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  async run(interaction) {
    await interaction.deferReply({ephemeral: true});
    const { options, memberPermissions, user, guild, appPermissions, member } =
      interaction;

    const userToBan = options.getMember("user") as GuildMember;
    const reason = options.getString("motivo") as string;

    if (!appPermissions.has("BanMembers")) {
      await interaction.editReply({
        content: "Eu não tenho permissão para banir menbros neste servidor.",
      });
      return;
    }
    if (!memberPermissions.has("BanMembers")) {
      await interaction.editReply({
        content: `Olá ${user.username}, você não tem permissão para usar este comando!`,
      });
      return;
    }
    
    setBanOptions({ user: userToBan, reason });

    const row = new ActionRowBuilder<ButtonBuilder>({
      components: [
        new ButtonBuilder({
          customId: "confirmBan",
          label: "Confirmar",
          style: ButtonStyle.Success,
        }),
        new ButtonBuilder({
          customId: "cancelBan",
          label: "Cancelar",
          style: ButtonStyle.Success,
        }),
      ],
    });

    await interaction.editReply({
      content: `Tem certeza que deseja banir ${userToBan.user.tag} por "${reason}"?`,
      components: [row],
    });
  },
});

interface BanOptions {
  user: GuildMember;
  reason: string;
}

let banOptions: BanOptions | null = null;

export const setBanOptions = (options: BanOptions) => {
  banOptions = options;
};

export const getBanOptions = () => {
  return banOptions;
};
