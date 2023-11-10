import { db } from "@/database";
import { log, settings } from "@/settings";
import { hexToRgb } from "@magicyan/discord";
import {
  ChannelType,
  EmbedBuilder,
  VoiceChannel,
  VoiceState,
  formatEmoji,
  spoiler,
  userMention,
} from "discord.js";

export async function autoVoiceChannel(
  oldState: VoiceState,
  newState: VoiceState
) {
  const { guild, channel, member } = oldState;

  const actionData = await db.get(db.guilds, guild.id);
  const mainChannelId = actionData?.global?.autoVoiceChannel;

  const mainChannel = guild.channels.cache.get(mainChannelId || "");

  if (!mainChannel?.isVoiceBased()) return;
  if (!member) return;

  //onLeave
  if (
    channel &&
    newState.channelId !== channel.id &&
    channel.parentId == mainChannel.parentId &&
    channel.name.includes(member.id)
  ) {
    channel.delete().catch(log.error);
  }

  // onJoin
  if (newState.channelId == mainChannelId) {
    if (channel?.parentId == mainChannel.parentId) {
      member?.voice.disconnect();
      return;
    }

    guild.channels
      .create({
        name: `${member.displayName} - ${member.id}`,
        parent: mainChannel.parentId,
        type: ChannelType.GuildVoice,
        permissionOverwrites: [
          { id: member.id, allow: ["Connect"] },
          { id: guild.id, allow: ["Connect"] },
        ],
      })
      .then((VoiceChannel) => {
        member.voice.setChannel(VoiceChannel);

        const emoji = formatEmoji(settings.emoji.static.check);

        VoiceChannel.send({
          content: spoiler(userMention(member.id)),
          embeds: [
            new EmbedBuilder({
              color: hexToRgb(settings.colors.theme.success),
              description: `${emoji} Sua sala foi criada com sucesso!`,
            }),
          ],
        });
      })
      .catch((err) => {
        member.voice.disconnect();
        log.error(err);
      });
  }
}
