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

        if (!queue)
            return await interaction.editReply(
                'There are no songs in the queue'
            );

        // To shuffle the queue
        queue.shuffle();

        await interaction.editReply({
            embeds: [
                new MessageEmbed().setDescription(
                    `Your queue of ${queue.tracks.length} songs has been shuffled`
                ),
            ],
        });
    },
};
