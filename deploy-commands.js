const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config.json');

const commands = [];
// Use fs to read directory of slash commands and filter it with *.js
const commandFiles = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js'));

// Iterate all files being read by fs above
for (const file of commandFiles) {
    // pass each file to command variable (as it being iterate)
    const command = require(`./commands/${file}`);
    // push new commands to the 'commands' array (declared above)
    commands.push(command.data.toJSON());
}

// Using REST to deploy slash commands and give it token
const rest = new REST({ version: '9' }).setToken(token);

/* Using REST and put the arg as Routes which generate URL with clientId
then deploy the body with commands array */
rest.put(Routes.applicationCommands(clientId), { body: commands })
    .then(() => console.log('Successfully registered application commands'))
    .catch(console.error);
