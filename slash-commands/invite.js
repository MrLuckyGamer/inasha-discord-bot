const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Get the bot's invite link."),

  async execute(interaction, client) {
    const clientId = client.user.id;
    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=8&scope=bot`;

    const ownerId = "320407113887252482";
    const owner = await client.users.fetch(ownerId);

    const embed = new EmbedBuilder()
      .setTitle("Invite Me")
      .setDescription(`[Click here to invite me](${inviteUrl})`)
      .setColor(8388736)
      .setThumbnail(client.user.displayAvatarURL({ size: 512 }))
      .setFooter({
        text: `Owner: ${owner.tag}`,
        iconURL: owner.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      flags: 0, // public reply (non-ephemeral)
    });
  },
};