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

        if (!queue)
            return await interaction.editReply(
                'There are no songs in the queue'
            );

        // Set the queue/music to pause
        queue.setPaused(true);

        await interaction.editReply({
            embeds: [
                new MessageEmbed().setDescription(
                    'Music has been paused, use `/resume` to resume the music'
                ),
            ],
        });
    },
};
