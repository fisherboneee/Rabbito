// Destructure object properties from discordjs/builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Destructure object properties from discord.js
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skipto')
        .setDescription('Skip to a certain track number in the queue')
        .addNumberOption((option) =>
            option
                .setName('tracknumber')
                .setDescription('Number of track to skip to')
                .setMinValue(1)
                .setRequired(true)
        ),
    run: async ({ client, interaction }) => {
        // Get queue from current guild (server)
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue)
            return await interaction.editReply(
                'There are no songs in the queue.'
            );

        const trackNum = interaction.options.getNumber('tracknumber');

        if (trackNum > queue.tracks.length)
            return interaction.editReply('Invalid track number!');
        // Skip to track number specify by user - 1 (because of array)
        queue.skipTo(trackNum - 1);

        await interaction.editReply({
            embeds: [
                new MessageEmbed().setDescription(
                    `Skipped ahead to track number ${trackNum}.`
                ),
            ],
        });
    },
};
