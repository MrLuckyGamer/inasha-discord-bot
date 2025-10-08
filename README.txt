# Inasha Discord Bot

**Inasha** is an all-purpose Discord bot with moderation, fun, and utility commands. It enhances server engagement, provides entertainment, and keeps communities safe. It supports both prefix commands (`i>`) and modern slash commands, includes server statistics tracking, and fun automatic responses.

## Features and Commands

### Utility Commands
| Command       | Description                                  |
|---------------|----------------------------------------------|
| `i>avatar`    | Show your avatar or another user's avatar.   |
| `i>botinfo`   | Display information about the bot.           |
| `i>help`      | List all commands grouped by category.       |
| `i>invite`    | Get the bot's invite link.                   |
| `i>ping`      | Check bot and API latency.                   |
| `i>serverinfo`| Show information about the server.           |
| `i>serverstats` | Enable or disable server statistics channels. |
| `i>uptime`    | Show bot uptime.                             |

### Moderation Commands
| Command | Description |
|---------|-------------|
| `i>ban`    | Ban a user from the server. |
| `i>kick`   | Kick a user from the server. |
| `i>lock`   | Lock the current channel. |
| `i>unlock` | Unlock the current channel. |
| `i>purge`  | Delete a number of messages from a channel. |
| `i>warn`   | Warn a user with a reason. |

### Fun Commands
| Command       | Description |
|---------------|-------------|
| `i>coinflip`  | Flip a coin. |
| `i>family`    | Manage & view family tree (add/remove, parent/child). |
| `i>fish`      | Go fishing and try to catch rare fish. |
| `i>fishlb`    | Show the top 10 fishers in the server. |
| `i>freaky`    | Check how freaky someone is. |
| `i>gay`       | Check how gay someone is. |
| `i>hug`       | Send a hug to someone. |
| `i>kiss`      | Send a kiss to someone. |
| `i>roll`      | Roll a random number between 0–100. |
| `i>rtd`       | Roll dice (e.g., `i>rtd 20` for d20). |
| `i>ship`      | Calculate love compatibility between two users. |
| `i>slap`      | Playfully slap someone. |

### Other Features
- Automatic server statistics updates (members, channels).
- Random fun responses for words like "meow" or "woof".
- Fully supports **slash commands** and traditional prefix commands (`i>`).

## Installation

### Prerequisites
- Node.js >= 18
- Discord.js ^14.15.3
- A Discord bot token