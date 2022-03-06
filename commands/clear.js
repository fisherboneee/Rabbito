// Destructure object properties from discordjs/builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Destructure object properties from discord.js
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear the queue'),
    run: async ({ client, interaction }) => {
        // Get queue from current guild (server)
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue)
            return await interaction.editReply(
                'There are no songs in the queue.'
            );

        // To clear the queue
        queue.clear();

        await interaction.editReply({
            embeds: [
                new MessageEmbed().setDescription(
                    '**Queue has been cleared!**'
                ),
            ],
        });
    },
};
