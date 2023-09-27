import { Component } from "@/discord/base";
import { getBanOptions } from "@/discord/commands/Admin/ban";

new Component({
  customId: "cancelBan",
  type: "Button",
  cache: "cached",
  async run(interaction) {
    getBanOptions();

    await interaction.update({ content: "Banimento cancelado", components: [] });
  },
});
