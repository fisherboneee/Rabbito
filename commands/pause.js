// Destructure object properties from discordjs/builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Destructure object properties from discord.js
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the music'),
    run: async ({ client, interaction }) => {
        // Get queue from current guild (server)
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue) {
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#EFAAC4')
                        .setAuthor({
                            name: 'Warning!',
                            iconURL: 'https://i.imgur.com/ACiGc2A.png',
                        })
                        .setTitle(
                            ':warning: — Rabbito is not connected to any voice channel.'
                        ),
                ],
            });
        } else if (!queue.current && queue.playing == false) {
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#EFAAC4')
                        .setAuthor({
                            name: 'Warning!',
                            iconURL: 'https://i.imgur.com/ACiGc2A.png',
                        })
                        .setTitle(
                            ':warning: — There are nothing to be paused for.'
                        ),
                ],
            });
        } else if (queue.playing == false) {
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#EFAAC4')
                        .setAuthor({
                            name: 'Warning!',
                            iconURL: 'https://i.imgur.com/ACiGc2A.png',
                        })
                        .setTitle(':warning: — The music has been paused!')
                        .setFooter({
                            text: 'Tip: Use /resume to resume the music.',
                        }),
                ],
            });
        }

        // Set the queue/music to pause
        queue.setPaused(true);

        // Set the playing state to false
        queue.playing = false;

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setColor('#EFAAC4')
                    .setAuthor({
                        name: 'Success!',
                        iconURL: 'https://i.imgur.com/ACiGc2A.png',
                    })
                    .setTitle(':pause_button: — Music has been paused!')
                    .setFooter({
                        text: 'Tip: Use /resume to resume the music.',
                    }),
            ],
        });
    },
};
