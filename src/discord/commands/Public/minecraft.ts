import { Command } from "@/discord/base";
import { fetchMinecraftServerStatus } from "@/functions";
import { settings } from "@/settings";
import { brBuilder, hexToRgb } from "@magicyan/discord";
import {
  ApplicationCommandType,
  ApplicationCommandOptionType,
  AttachmentBuilder,
  EmbedBuilder,
  inlineCode,
} from "discord.js";

new Command({
  name: "minecraft",
  description: "Comando de minecraft",
  dmPermission,
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "servidores",
      description: "Comando de servidor de minecraft",
      type: ApplicationCommandOptionType.SubcommandGroup,
      options: [
        {
          name: "status",
          description: "Verificar status de um servidor",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "ip",
              description: "Ip do servidor",
              type: ApplicationCommandOptionType.String,
              required,
            },
          ],
        },
      ],
    },
  ],
  async run(interaction) {
    const { options } = interaction;

    const group = options.getSubcommandGroup(true);
    const subCommand = options.getSubcommand(true);

    switch (group) {
      case "servidores": {
        switch (subCommand) {
          case "status": {
            const serverIp = options.getString("ip", true);

            await interaction.deferReply({ ephemeral });

            const response = await fetchMinecraftServerStatus(serverIp);
            if (!response.success || !response.data.hostname) {
              interaction.editReply({
                content: `Não foram encontrados dados para o servidor com o ip: \`${serverIp}\``,
              });
              return;
            }

            const { data } = response;

            const ip = inlineCode(data.hostname || "Indisponivel");
            const numericIp = inlineCode(data.ip || "Indisponivel");
            const onlineStatus = data.online ? "👍" : "👎";
            const players = data.players?.max
              ? inlineCode(`${data.players?.online}/${data.players?.max}`)
              : "Indisponivel";
            const version = data.version || "Indisponivel";

            const embed = new EmbedBuilder({
              title: serverIp,
              color: hexToRgb(
                data.online
                  ? settings.colors.theme.success
                  : settings.colors.theme.danger
              ),
              thumbnail: { url: "attachment://thumb.png" },

              description: brBuilder(
                `online: ${onlineStatus}`,
                `IP: ${ip}`,
                `IP numérioco: ${numericIp}`,
                `jogadores: ${players}`,
                `Versão: ${version}`
              ),
            });

            const files: AttachmentBuilder[] = [];

            if (data.icon) {
              const base64string = data.icon.replace(
                "data:image\/png;base64,",
                ""
              );
              const buffer = Buffer.from(base64string, "base64");
              files.push(new AttachmentBuilder(buffer, { name: "thumb.png" }));
            }

            interaction.editReply({ embeds: [embed], files });
            return;
          }
        }

        return;
      }
    }
  },
});
