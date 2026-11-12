
const { Client, GatewayIntentBits } = require("discord.js");

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.TARGET_CHANNEL_ID;

if (!TOKEN || !CHANNEL_ID) {
  throw new Error("Missing bot token or security channel ID!");
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages
  ]
});

client.once("ready", () => {
  console.log(`🛡️ Security Guard online as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  // Ignore bots and messages outside servers
  if (!message.guild || message.author.bot) return;

  // Only monitor the security channel
  if (message.channelId !== CHANNEL_ID) return;

  try {
    await message.guild.members.ban(message.author.id, {
      reason: "Posted in the security channel"
    });

    console.log(`Banned ${message.author.tag}`);
  } catch (error) {
    console.error("Ban failed:", error);
  }
});

client.login(TOKEN);
