// Destructure object properties from discordjs/builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Destructure object properties from discord.js
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the music'),
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
                            ':warning: — There are no songs in the queue.'
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
                            ':warning: — There are nothing to be resumed for.'
                        ),
                ],
            });
        } else if (queue.playing == true) {
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#EFAAC4')
                        .setAuthor({
                            name: 'Warning!',
                            iconURL: 'https://i.imgur.com/ACiGc2A.png',
                        })
                        .setTitle(':warning: — The music is still playing!'),
                ],
            });
        }

        // Set the queue/music to resume
        queue.setPaused(false);

        // Set the playing state to true
        queue.playing = true;

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setColor('#EFAAC4')
                    .setAuthor({
                        name: 'Success!',
                        iconURL: 'https://i.imgur.com/ACiGc2A.png',
                    })
                    .setTitle(':arrow_forward: — Music has been resumed!'),
            ],
        });
    },
};
