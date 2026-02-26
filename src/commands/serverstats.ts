import { ChannelType, PermissionFlagsBits, Message, Client, Guild } from "discord.js";
import fs from "fs";
import { PrefixCommand } from "../types";

const file = "./data/serverstats/serverstats.json";

interface StatsChannelData {
  category: string;
  users: string;
  bots: string;
  channels: string;
}

interface StatsData {
  [guildId: string]: StatsChannelData;
}

let statsChannels: StatsData = fs.existsSync(file) 
  ? JSON.parse(fs.readFileSync(file, "utf8")) 
  : {};

// === SAVE FILE ===
function saveStats(): void {
  fs.writeFileSync(file, JSON.stringify(statsChannels, null, 2));
}

// === FETCH QUEUE SYSTEM ===
class FetchQueue {
  private queue: Array<{ guild: Guild; resolve: (value: number) => void }> = [];
  private processing: boolean = false;
  private lastFetchTimes: Map<string, number> = new Map();
  private MIN_DELAY: number = 6000; // 6 seconds minimum between fetches

  async add(guild: Guild): Promise<number> {
    return new Promise((resolve) => {
      this.queue.push({ guild, resolve });
      this.process();
    });
  }

  async process(): Promise<void> {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;

    while (this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) break;
      
      const { guild, resolve } = item;
      
      try {
        const lastFetch = this.lastFetchTimes.get(guild.id);
        const now = Date.now();
        
        if (lastFetch) {
          const timeSince = now - lastFetch;
          if (timeSince < this.MIN_DELAY) {
            const waitTime = this.MIN_DELAY - timeSince;
            console.log(`Waiting ${Math.ceil(waitTime / 1000)}s before fetching ${guild.name}`);
            await new Promise(r => setTimeout(r, waitTime));
          }
        }

        console.log(`Fetching members for ${guild.name}...`);
        await guild.members.fetch({ force: true });
        this.lastFetchTimes.set(guild.id, Date.now());
        
        const botCount = guild.members.cache.filter(m => m.user.bot).size;
        resolve(botCount);

        await new Promise(r => setTimeout(r, 1000));
        
      } catch (error: any) {
        console.error(`Error fetching members for ${guild.name}:`, error);

        if (error.code === 'GatewayRateLimitError' || error.status === 429) {
          const retryAfter = (error.data?.retry_after || 5) * 1000;
          console.log(`Rate limited! Waiting ${Math.ceil(retryAfter / 1000)}s before continuing...`);
          await new Promise(r => setTimeout(r, retryAfter + 1000));

          this.queue.unshift({ guild, resolve });
        } else {
          const botCount = guild.members.cache.filter(m => m.user.bot).size;
          resolve(botCount);
        }
      }
    }

    this.processing = false;
  }
}

const fetchQueue = new FetchQueue();

// === GET BOT COUNT ===
async function getBotCount(guild: Guild): Promise<number> {
  try {
    const cachedCount = guild.members.cache.filter(m => m.user.bot).size;

    if (cachedCount > 0 && guild.members.cache.size > 10) {
      console.log(`Using cached bot count for ${guild.name}: ${cachedCount}`);
      return cachedCount;
    }

    console.log(`Queuing member fetch for ${guild.name}`);
    return await fetchQueue.add(guild);
    
  } catch (error) {
    console.error(`Error in getBotCount for ${guild.name}:`, error);
    return guild.members.cache.filter(m => m.user.bot).size;
  }
}

// === UPDATE STATS ===
export async function updateStats(guild: Guild): Promise<void> {
  const data = statsChannels[guild.id];
  if (!data) return;

  try {
    const bots = await getBotCount(guild).catch(() => 0);
    const total = typeof guild.memberCount === "number" ? guild.memberCount : 0;
    const users = Math.max(0, total - bots);

    const channels = guild.channels.cache.filter(ch => 
      ch.type === ChannelType.GuildText || ch.type === ChannelType.GuildVoice
    ).size;

    const updateChannel = (id: string, name: string) => {
      const ch = guild.channels.cache.get(id);
      if (ch) ch.setName(name).catch(() => {});
    };

    updateChannel(data.users, `👥 Users: ${users}`);
    updateChannel(data.bots, `🤖 Bots: ${bots}`);
    updateChannel(data.channels, `💬 Channels: ${channels}`);

    const category = guild.channels.cache.get(data.category);
    if (category) category.setPosition(0).catch(() => {});
    
    console.log(`Updated stats for ${guild.name}: ${users} users, ${bots} bots, ${channels} channels`);
  } catch (error) {
    console.error(`Error updating stats for ${guild.name}:`, error);
  }
}

const command: PrefixCommand = {
  name: "serverstats",
  description: "Enable or disable server statistics channels.",
  category: "Utility",

  async execute(message: Message, args: string[], client: Client): Promise<void> {
    if (!message.member?.permissions.has(PermissionFlagsBits.ManageGuild)) {
      await message.reply("You need **Manage Server** permission to use this command.");
      return;
    }

    if (!message.guild) {
      await message.reply("This command can only be used in a server.");
      return;
    }

    const sub = args[0]?.toLowerCase();

    // === ENABLE ===
    if (sub === "enable") {
      if (statsChannels[message.guild.id]) {
        await message.reply("Stats are already enabled in this server.");
        return;
      }

      const category = await message.guild.channels.create({
        name: "📊 Server Stats 📊",
        type: ChannelType.GuildCategory,
        position: 0,
      });

      async function createStatChannel(name: string) {
        return await message.guild!.channels.create({
          name,
          type: ChannelType.GuildVoice,
          parent: category.id,
          permissionOverwrites: [
            {
              id: message.guild!.id,
              deny: [PermissionFlagsBits.Connect],
            },
          ],
        });
      }

      const usersChannel = await createStatChannel("👥 Users: 0");
      const botsChannel = await createStatChannel("🤖 Bots: 0");
      const channelsChannel = await createStatChannel("💬 Channels: 0");

      statsChannels[message.guild.id] = {
        category: category.id,
        users: usersChannel.id,
        bots: botsChannel.id,
        channels: channelsChannel.id,
      };

      saveStats();

      updateStats(message.guild).catch(err => 
        console.error(`Stats update error for ${message.guild!.name}:`, err)
      );

      await message.reply("Server stats have been enabled! Stats will update shortly.");
      return;
    }

    // === DISABLE ===
    else if (sub === "disable") {
      const data = statsChannels[message.guild.id];
      if (!data) {
        await message.reply("Stats are not enabled in this server.");
        return;
      }

      const category = message.guild.channels.cache.get(data.category);
      if (category) await category.delete().catch(() => {});

      for (const key of ["users", "bots", "channels"] as const) {
        const id = data[key];
        if (!id) continue;
        const ch = message.guild.channels.cache.get(id);
        if (ch) await ch.delete().catch(() => {});
      }

      delete statsChannels[message.guild.id];
      saveStats();

      await message.reply("Server stats have been disabled and removed.");
      return;
    }

    await message.reply("Usage: `i>serverstats enable` or `i>serverstats disable`");
  },
};

export = command;