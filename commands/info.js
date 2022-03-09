// Destructure object properties from discordjs/builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Destructure object properties from discord.js
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Display current playing song information'),
    run: async ({ client, interaction }) => {
        // Get queue from current guild (server)
        const queue = client.player.getQueue(interaction.guildId);

        // Variable containing info about current playing song
        const song = queue.current;

        // If no current playing song from the queue or song being paused
        if (!song || queue.playing == false) {
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#EFAAC4')
                        .setAuthor({
                            name: 'Warning!',
                            iconURL: 'https://i.imgur.com/ACiGc2A.png',
                        })
                        .setTitle(
                            ':warning: — There are no song(s) playing right now.'
                        ),
                ],
            });
        }

        /* Create progress bar for the song, specify queue false so that it will only display current playing song
        Length would be the bar length, 20 is ideal */
        let progBar = queue.createProgressBar({
            queue: false,
            length: 20,
        });

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setColor('#EFAAC4')
                    .setThumbnail(song.thumbnail)
                    .setAuthor({
                        name: 'Rabbito',
                        iconURL: 'https://i.imgur.com/ACiGc2A.png',
                    })
                    .setTitle(':arrow_forward: — Now Playing\n\u200B')
                    .setDescription(progBar)
                    .addFields(
                        {
                            name: 'Channel',
                            value: `${song.author}`,
                            inline: true,
                        },
                        {
                            name: 'Title',
                            value: `[${song.title}](${song.url})`,
                            inline: true,
                        },
                        {
                            name: 'Duration',
                            value: `${song.duration}`,
                            inline: true,
                        }
                    ),
            ],
        });
    },
};
