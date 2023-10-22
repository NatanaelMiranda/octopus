import { Command } from "@/discord/base";
import { ApplicationCommandType, Guild, GuildMember } from "discord.js";

new Command({
  name: "apagar mensagem",
  dmPermission: false,
  type: ApplicationCommandType.Message,
  async run(interaction) {
    if (!interaction.isMessageContextMenuCommand()) return;

    const message = interaction.member as GuildMember;
    const guild = interaction.guild as Guild;
    const { targetMessage } = interaction;

    await targetMessage.delete().catch((reason) => console.log(reason));

    const { author, channel } = targetMessage;

    interaction.reply({ephemeral: true, content: "A mensagem foi deletada!" });
  },
});
