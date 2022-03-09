// Destructure object properties from discordjs/builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Destructure object properties from discord.js
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leave')
        .setDescription(
            'Stop, leave the bot from voice channel and clear the queue'
        ),
    run: async ({ client, interaction }) => {
        // Get queue from current guild (server)
        const queue = client.player.getQueue(interaction.guildId);

        // If Rabbito is not connected to the voice channel
        if (!queue)
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

        // To destroy the queue and exit the voice channel simultaneously
        queue.destroy();

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setColor('#EFAAC4')
                    .setAuthor({
                        name: 'Success!',
                        iconURL: 'https://i.imgur.com/ACiGc2A.png',
                    })
                    .setTitle(
                        ':white_check_mark: — Disconnected from voice channel.'
                    ),
            ],
        });
    },
};
