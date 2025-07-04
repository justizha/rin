import { Client, Collection, GatewayIntentBits } from "discord.js";
import fs from "node:fs";
import { config } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const commandModule = await import(`file://${filePath}`);
  const command = commandModule.default;
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log(`✅ ${client.user.tag} is ready to serve random images!`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "Oops! Something went wrong while fetching your image.",
      ephemeral: true,
    });
  }
});

const commands = [];
for (const [name, command] of client.commands) {
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log("Registering slash commands...");
  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID), // Add CLIENT_ID to your .env
    { body: commands }
  );
  console.log("✅ Slash commands registered!");
} catch (error) {
  console.error("❌ Error registering commands:", error);
}

client.login(process.env.DISCORD_TOKEN);
