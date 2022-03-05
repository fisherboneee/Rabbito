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

        if (!queue)
            return await interaction.editReply(
                'There are no songs in the queue.'
            );

        /* Create progress bar for the song, specify queue false so that it will only display current playing song
        Length would be the bar length, 19 is ideal */
        let progBar = queue.createProgressBar({
            queue: false,
            length: 19,
        });

        // Variable containing info about current playing song
        const song = queue.current;

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `**Currently Playing:** [${song.title}](${song.url})\n\n` +
                            progBar
                    )
                    .setThumbnail(song.thumbnail),
            ],
        });
    },
};
