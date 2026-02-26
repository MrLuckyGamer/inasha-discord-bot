import { 
  Client, 
  Message, 
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Collection 
} from "discord.js";

export interface BotConfig {
  token: string;
  prefix: string;
  clientId: string;
  guildId: string;
}

export interface PrefixCommand {
  name: string;
  description: string;
  category: string;
  execute: (message: Message, args: string[], client: Client) => Promise<void>;
}

export interface SlashCommand {
  data: SlashCommandBuilder;
  execute: (interaction: ChatInputCommandInteraction, client: Client) => Promise<void>;
}

export interface ExtendedClient extends Client {
  commands: Collection<string, PrefixCommand>;
  slashCommands: Collection<string, SlashCommand>;
}

export interface FishData {
  [guildId: string]: {
    [userId: string]: number;
  };
}

export interface CooldownData {
  [guildId: string]: {
    [userId: string]: number;
  };
}

export interface Fish {
  name: string;
  min: number;
  max: number;
  weight: number;
}

export interface ServerStatsData {
  [guildId: string]: {
    memberCountChannelId?: string;
    channelCountChannelId?: string;
  };
}