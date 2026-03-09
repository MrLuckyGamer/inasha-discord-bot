const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "userinfo",
  description: "Display information about a user",
  category: "Utility",
  async execute(message, args) {
    // Get the mentioned user or the message author
    const member = message.mentions.members.first() || message.member;
    const user = member.user;

    // Calculate account age
    const accountCreated = Math.floor(user.createdTimestamp / 1000);
    
    // Calculate server join date
    const joinedServer = Math.floor(member.joinedTimestamp / 1000);

    // Get user's roles (excluding @everyone)
    const roles = member.roles.cache
      .filter(role => role.id !== message.guild.id)
      .sort((a, b) => b.position - a.position)
      .map(role => role.toString())
      .slice(0, 20); // Limit to 20 roles to avoid embed being too long

    const roleDisplay = roles.length > 0 ? roles.join(", ") : "None";
    const roleCount = member.roles.cache.size - 1; // Exclude @everyone

    // Get user's status
    const presence = member.presence;
    const status = presence?.status || "offline";
    const statusEmojis = {
      online: "🟢",
      idle: "🟡",
      dnd: "🔴",
      offline: "⚫"
    };

    // Get user's activity
    let activity = "None";
    if (presence?.activities && presence.activities.length > 0) {
      const mainActivity = presence.activities[0];
      activity = `${mainActivity.type === 0 ? "Playing" : mainActivity.type === 1 ? "Streaming" : mainActivity.type === 2 ? "Listening to" : mainActivity.type === 3 ? "Watching" : "Custom Status"} ${mainActivity.name}`;
    }

    // Check if user is boosting
    const boostingSince = member.premiumSince;
    const boostingText = boostingSince ? `<t:${Math.floor(boostingSince.getTime() / 1000)}:R>` : "Not Boosting";

    // Get permissions
    const keyPermissions = member.permissions.toArray()
      .filter(perm => ["Administrator", "ManageGuild", "ManageRoles", "ManageChannels", "KickMembers", "BanMembers", "ModerateMembers"].includes(perm))
      .join(", ");

    const embed = new EmbedBuilder()
      .setColor(member.displayHexColor || "#5865F2")
      .setAuthor({ 
        name: `${user.tag}`, 
        iconURL: user.displayAvatarURL({ dynamic: true }) 
      })
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .addFields(
        { 
          name: "👤 User Information", 
          value: `**ID:** ${user.id}\n**Mention:** ${user}\n**Bot:** ${user.bot ? "Yes" : "No"}`,
          inline: false 
        },
        { 
          name: "📅 Account Created", 
          value: `<t:${accountCreated}:F>\n(<t:${accountCreated}:R>)`,
          inline: true 
        },
        { 
          name: "📥 Joined Server", 
          value: `<t:${joinedServer}:F>\n(<t:${joinedServer}:R>)`,
          inline: true 
        },
        { 
          name: `💼 Roles [${roleCount}]`, 
          value: roleDisplay,
          inline: false 
        }
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) });

    // Add status and activity
    embed.addFields({
      name: "📊 Status & Activity",
      value: `**Status:** ${statusEmojis[status]} ${status.charAt(0).toUpperCase() + status.slice(1)}\n**Activity:** ${activity}`,
      inline: false
    });

    // Add boosting info
    embed.addFields({
      name: "💎 Server Boost",
      value: boostingText,
      inline: true
    });

    // Add key permissions if any
    if (keyPermissions) {
      embed.addFields({
        name: "🔑 Key Permissions",
        value: keyPermissions,
        inline: true
      });
    }

    message.channel.send({ embeds: [embed] });
  },
};