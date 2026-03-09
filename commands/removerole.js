const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  name: "removerole",
  description: "Remove a role from a user",
  category: "Moderation",
  async execute(message, args) {
    // Check if user has permission to manage roles
    if (!message.member.permissions.has(PermissionFlagsBits.ManageRoles)) {
      const noPermEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("You don't have permission to manage roles!");
      return message.channel.send({ embeds: [noPermEmbed] });
    }

    // Check if bot has permission to manage roles
    if (!message.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
      const botNoPermEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("I don't have permission to manage roles!");
      return message.channel.send({ embeds: [botNoPermEmbed] });
    }

    // Get the mentioned user
    const member = message.mentions.members.first();
    if (!member) {
      const noUserEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("Please mention a user to remove a role from!\nUsage: `removerole @user @role` or `removerole @user role name`");
      return message.channel.send({ embeds: [noUserEmbed] });
    }

    // Get the role
    let role = message.mentions.roles.first();
    
    // If no role mentioned, try to find by name
    if (!role) {
      const roleName = args.slice(1).join(" ");
      if (!roleName) {
        const noRoleEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("Please specify a role!\nUsage: `removerole @user @role` or `removerole @user role name`");
        return message.channel.send({ embeds: [noRoleEmbed] });
      }
      
      role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase());
      if (!role) {
        const roleNotFoundEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(`Could not find a role named "${roleName}"!`);
        return message.channel.send({ embeds: [roleNotFoundEmbed] });
      }
    }

    // Check if bot's highest role is higher than the role to remove
    if (message.guild.members.me.roles.highest.position <= role.position) {
      const roleHierarchyEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("I cannot manage this role as it is higher than or equal to my highest role!");
      return message.channel.send({ embeds: [roleHierarchyEmbed] });
    }

    // Check if user's highest role is higher than the role to remove
    if (message.member.roles.highest.position <= role.position && message.guild.ownerId !== message.author.id) {
      const userHierarchyEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("You cannot manage this role as it is higher than or equal to your highest role!");
      return message.channel.send({ embeds: [userHierarchyEmbed] });
    }

    // Check if user doesn't have the role
    if (!member.roles.cache.has(role.id)) {
      const doesntHaveEmbed = new EmbedBuilder()
        .setColor("Orange")
        .setDescription(`${member} doesn't have the ${role} role!`);
      return message.channel.send({ embeds: [doesntHaveEmbed] });
    }

    try {
      await member.roles.remove(role);
      const successEmbed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`Successfully removed ${role} from ${member}!`)
        .setTimestamp();
      message.channel.send({ embeds: [successEmbed] });
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("An error occurred while trying to remove the role!");
      message.channel.send({ embeds: [errorEmbed] });
    }
  },
};