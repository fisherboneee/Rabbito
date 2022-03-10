// fs is used for reading files
const fs = require('fs');
// Destructuring object properties from discord.js
const { Client, Collection, Intents } = require('discord.js');
// Destructuring object properties from config.json
const { token } = require('./config.json');
// Destructuring object properties from discord-player
const { Player } = require('discord-player');

// Creating Discord Client with specifying Intents
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
});

// Assign new object properties under Client to Collection (for Slash Commands)
// PS: Collection is actually extended version of JavaScript Map (aka Object)
client.commands = new Collection();

// Assign new object properties under Client to Player (bind discord-player)
client.player = new Player(client, {
    ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
    },
});

// Use fs to read directory of slash commands and filter it with *.js
const commandFiles = fs
    .readdirSync('./commands')
    .filter((file) => file.endsWith('.js'));

// Iterate all files being read by fs above
for (const file of commandFiles) {
    // pass each file to command variable (as it being iterate)
    const command = require(`./commands/${file}`);
    /* use Collection (declared above in client.commands) to set slash commands
    eg:
    first arg: ping, second arg: ping command in JSON */
    client.commands.set(command.data.name, command);
    /* alt comment: Set a new item in the Collection with the key as the command name 
    and the value as the exported module */
}

client.once('ready', () => {
    console.log('Rabbito is ready for action!');

    // Setting up bot Rich Presence!
    client.user.setPresence({
        activities: [{ name: 'songs for s̶e̶u̶ you!', type: 'PLAYING' }],
        status: 'online',
    });

    /* To be used for removing guild commands
    as it might duplicate with global commands
    use only when needed! (don't forget to replace the id with guildID) */
    // client.guilds.cache.get(id).commands.set([]);

    /* To be used for removing global commands
    as it might duplicate with guild commands
    Use only needed! (~1 hour to update)*/
    // client.application.commands.set([]);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    // Get commands from Collection using get by the name of interaction (invoked application command name)
    const command = client.commands.get(interaction.commandName);

    if (!command) await interaction.reply("Commands doesn't exist");

    /* By default, Discord only give you 3 seconds to respond the slash commands
    This method will give you extra time to respond to the slash commands */
    /* await interaction.deferReply();
    await command.run({ client, interaction }); */

    try {
        // await command.execute(interaction);
        await interaction.deferReply();
        await command.run({ client, interaction });
    } catch (error) {
        console.error(error);
        await interaction.editReply({
            content: 'There was an error while executing this command.',
            ephemeral: true,
        });
    }
});

client.login(token);
