import { Command, Component, Modal } from "@/discord/base";
import { reply } from "@/functions";
import { settings } from "@/settings";
import {
  brBuilder,
  createModalInput,
  createRow,
  hexToRgb,
} from "@magicyan/discord";
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  Attachment,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Collection,
  ComponentType,
  EmbedBuilder,
  ModalBuilder,
  TextChannel,
  TextInputStyle,
  codeBlock,
  formatEmoji,
} from "discord.js";

interface messageProps {
  channelId: string;
  image: Attachment | null;
}
const members: Collection<string, messageProps> = new Collection();

new Command({
  name: "anuncio",
  description: "Comando de anúncios",
  dmPermission,
  defaultMemberPermissions: ["Administrator", "ManageMessages"],
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "canal",
      description: "Cancal onde será enviado o anúncio",
      type: ApplicationCommandOptionType.Channel,
      channelTypes: [ChannelType.GuildText],
      required,
    },
    {
      name: "imagem",
      description: "Imagem anexada no anúncio",
      type: ApplicationCommandOptionType.Attachment,
    },
  ],
  async run(interaction) {
    const { options, guild, member } = interaction;

    const channel = options.getChannel("canal", true);
    const image = options.getAttachment("imagem");

    members.set(member.id, { channelId: channel.id, image });

    await interaction.showModal(
      new ModalBuilder({
        customId: "announcement-modal",
        title: "Fazer um anúncio",
        components: [
          createModalInput({
            customId: "announcement-title-input",
            label: "Título",
            placeholder: "Insira o tiítulo",
            style: TextInputStyle.Short,
            maxLength: 256,
          }),
          createModalInput({
            customId: "announcement-description-input",
            label: "Descrição",
            placeholder: "Insira a descrição",
            style: TextInputStyle.Paragraph,
            maxLength: 4000,
          }),
        ],
      })
    );
  },
});

new Modal({
  customId: "announcement-modal",
  cache: "cached",
  async run(interaction) {
    const { fields, guild, member } = interaction;

    const messageProps = members.get(member.id);

    if (!messageProps) {
      reply.danger({
        interaction,
        text: brBuilder(
          "Não foi possivel obter os dados iniciais!",
          "Ultilize o comando novamente."
        ),
      });
      return;
    }

    const title = fields.getTextInputValue("announcement-title-input");
    const description = fields.getTextInputValue(
      "announcement-description-input"
    );

    const embed = new EmbedBuilder({
      title,
      description,
      color: hexToRgb(settings.colors.theme.default),
      image: { url: "attachment://image.png" },
    });

    await interaction.deferReply({ ephemeral, fetchReply });

    const files: AttachmentBuilder[] = [];

    if (messageProps.image) {
      files.push(
        new AttachmentBuilder(messageProps.image.url, { name: "image.png" })
      );
    }

    const message = await interaction.editReply({
      embeds: [embed],
      files,
      components: [
        createRow(
          new ButtonBuilder({
            customId: "announcement-confirm-button",
            label: "confirm",
            emoji: settings.emoji.static.check,
            style: ButtonStyle.Success,
          }),
          new ButtonBuilder({
            customId: "announcement-cancel-button",
            label: "Cancelar",
            emoji: settings.emoji.static.cancel,
            style: ButtonStyle.Danger,
          })
        ),
      ],
    });

    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
    });
    collector.on("collect", async (subInteraction) => {
      const { customId } = subInteraction;
      collector.stop();

      if (customId === "announcement-cancel-button") {
      
        reply.danger({
          interaction, update: true, clear: true, text: "Ação cancelada"
        });
        return;
      }

      await subInteraction.deferUpdate();

      const channel = guild.channels.cache.get(
        messageProps.channelId
      ) as TextChannel;

      channel
        .send({
          embeds: [embed],
          files,
        })
        .then((msg) => {
          const emoji = formatEmoji(settings.emoji.static.check);

          reply.success({
            interaction,
            update: true,
            clear: true,
            text: `${emoji} Mensagem enviada com sucessao! Confira ${msg.url}`,
          });
        })
        .catch((err) => {
          const emoji = formatEmoji(settings.emoji.static.cancel);

          reply.danger({
            interaction,
            update: true,
            clear: true,
            text: brBuilder(
              `${emoji} Não foi possivel enviar a mensagem`,
              codeBlock("bash", err)
            ),
          });
        });
    });
    members.delete(member.id);
  },
});
