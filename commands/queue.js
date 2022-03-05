// Destructure object properties from discordjs/builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Destructure object properties from discord.js
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Display current song queue')
        // Different from stringOption, this numberOption is used for pagination (to display all queue in pages)
        .addNumberOption((option) =>
            option
                .setName('page')
                .setDescription('Page number of the queue')
                .setMinValue(1)
        ),
    run: async ({ client, interaction }) => {
        // Get queue from current guild (server)
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue || !queue.playing)
            return await interaction.editReply(
                'There are no songs in the queue.'
            );

        // Math.ceil is round down method (11 tracks = 2 pages) or 1 page at max.
        const totalPages = Math.ceil(queue.tracks.length / 10) || 1;
        /* Page number is not required, so need to try get number page like so that it wouldn't return null
        Also it returned array, so we need to index it back to 0 for first page */
        const page = (interaction.options.getNumber('page') || 1) - 1;

        // Verify the page given by user
        if (page > totalPages)
            return await interaction.editReply(
                `Invalid page. There are only a total of ${totalPages} pages of songs.`
            );

        /* Returned array to get the queue string where it will be displayed
        Use slice function to slice down the track to one page (that's why page * 10)
        The second arg which is page * 10 + 10 indicate that all next pages will be added with 10 more song after
        Using map function to map each of the key (song) and value (index of the array) for each song to string
        .join('\n') to turn it into a single string */
        const queueString = queue.tracks
            .slice(page * 10, page * 10 + 10)
            .map((song, i) => {
                /* Use this formula to check whether what song number should be displayed on the page
                For example, if it's given page is 0, following that formula we will display song #1 on page 1 (index 0)
                Backslash backtick (\` content \`) to display in a codeblock format (discord) */
                return `**${page * 10 + i + 1}.** \`[${song.duration}]\` ${
                    song.title
                } -- <@${song.requestedBy.id}>`;
            })
            .join('\n');

        // Return current song in the queue
        const currentSong = queue.current;

        // and reply to the channel the embeds that has been created
        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                    .setDescription(
                        `**Currently Playing:**\n` +
                            (currentSong
                                ? `\`[${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>`
                                : 'None') +
                            `\n\n**Queue:**\n${queueString}`
                    )
                    .setFooter({
                        text: `Page ${page + 1} of ${totalPages}`,
                    })
                    .setThumbnail(currentSong.thumbnail),
            ],
        });
    },
};
