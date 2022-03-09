// Destructure object properties from discordjs/builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Destructure object properties from discord.js
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Shuffles the queue'),
    run: async ({ client, interaction }) => {
        // Get queue from current guild (server)
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue || queue.tracks.length < 2) {
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#EFAAC4')
                        .setAuthor({
                            name: 'Warning!',
                            iconURL: 'https://i.imgur.com/ACiGc2A.png',
                        })
                        .setTitle(
                            ':warning: — There need to be at least 2 songs in the queue to shuffle.'
                        ),
                ],
            });
        }

        // To shuffle the queue
        queue.shuffle();

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setColor('#EFAAC4')
                    .setAuthor({
                        name: 'Success!',
                        iconURL: 'https://i.imgur.com/ACiGc2A.png',
                    })
                    .setTitle(
                        `:twisted_rightwards_arrows: — Your queue of ${queue.tracks.length} songs has been shuffled.`
                    ),
            ],
        });
    },
};
