import { Client, Collection, GatewayIntentBits } from 'discord.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	try {
		const commandModule = await import(`file://${filePath}`);
		const command = commandModule.default;

		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
			console.log(`✅ Loaded command: ${command.data.name}`);
		} else {
			console.log(`⚠️ Command at ${filePath} is missing required "data" or "execute" property.`);
		}
	} catch (error) {
		console.error(`❌ Error loading command ${file}:`, error);
	}
}

const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		try {
			const eventModule = await import(`file://${filePath}`);
			const event = eventModule.default;

			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args));
			} else {
				client.on(event.name, (...args) => event.execute(...args));
			}
			console.log(`✅ Loaded event: ${event.name}`);
		} catch (error) {
			console.error(`❌ Error loading event ${file}:`, error);
		}
	}
}

client.login(process.env.DISCORD_TOKEN).catch(error => {
	console.error('❌ Failed to login:', error);
});