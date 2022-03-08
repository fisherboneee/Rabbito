// Destructure object properties from discordjs/builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Destructure object properties from discord.js
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show commands available for this bot'),
    run: async ({ interaction }) => {
        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setColor('#EFAAC4')
                    .setAuthor({
                        name: 'Rabbito',
                        iconURL: 'https://i.imgur.com/ACiGc2A.png',
                    })
                    .setTitle('Rabbito, help me!')
                    .setThumbnail('https://i.imgur.com/ACiGc2A.png')
                    .addFields(
                        {
                            name: 'Play music in voice channel',
                            value: '/play song - Play song from URL\n/play search - Play song from search keywords\n/play playlist - Play songs fetch from playlist',
                        },
                        {
                            name: 'Show Now Playing & songs in the queue',
                            value: '/queue',
                        },
                        { name: 'Show currently playing song', value: '/info' },
                        {
                            name: 'Set loop mode',
                            value: '/loop off - Set the loop mode to OFF\n/loop song - Set the loop mode to SONG \n/loop queue - Set the loop mode to QUEUE',
                        },
                        { name: 'Shuffle the queue', value: '/shuffle' },
                        { name: 'Pause the music', value: '/pause' },
                        { name: 'Resume the music', value: '/resume' },
                        {
                            name: 'Skip to the next song in the queue',
                            value: '/skip',
                        },
                        {
                            name: 'Skip to the track number in the queue',
                            value: '/skipto',
                        },
                        { name: 'Clear the queue', value: '/clear' },
                        {
                            name: 'Disconnect bot from voice channel',
                            value: '/leave',
                        }
                    )
                    .setFooter({ text: 'Thank you Rabbito!' }),
            ],
        });
    },
};
