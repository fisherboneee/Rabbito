// Destructure object properties from discordjs/builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Destructure object properties from discord.js
const { MessageEmbed } = require('discord.js');
// Destructure object properties from discord-player
const { QueryType } = require('discord-player');

// Export the module
module.exports = {
    // Slash command data
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play/Queue songs to be played in your voice channel')
        /* Add subcommand (like an argument required)
        First subcommand: Load song from URL */
        .addSubcommand((subcommand) =>
            subcommand
                .setName('song')
                .setDescription('Load a single song from URL')
                .addStringOption((option) =>
                    option
                        .setName('url')
                        .setDescription("Song's URL")
                        .setRequired(true)
                )
        )
        // Second subcommand: Load song from playlist URL
        .addSubcommand((subcommand) =>
            subcommand
                .setName('playlist')
                .setDescription('Load a playlist of songs from URL')
                .addStringOption((option) =>
                    option
                        .setName('url')
                        .setDescription('The playlist URL')
                        .setRequired(true)
                )
        )
        // Third subcommand: Search keywords to play song
        .addSubcommand((subcommand) =>
            subcommand
                .setName('search')
                .setDescription('Search song based on provided keywords')
                .addStringOption((option) =>
                    option
                        .setName('keywords')
                        .setDescription('Search keywords')
                        .setRequired(true)
                )
        ),
    run: async ({ client, interaction }) => {
        // Validating if user is in the voice channel
        if (!interaction.member.voice.channel)
            return interaction.editReply(
                'You need to be in a voice channel to use this command.'
            );

        const queue = await client.player.createQueue(interaction.guild, {
            initialVolume: 40,
            leaveOnEnd: false,
            volumeSmoothness: false,
        });

        if (!queue.connection)
            await queue.connect(interaction.member.voice.channel);

        // Declaration of embed message
        let embed = new MessageEmbed();
        // Getting the subcommand
        if (interaction.options.getSubcommand() === 'song') {
            // Grab the addStringOption name/string
            let url = interaction.options.getString('url');
            // Using discord-player search function (able to change the searchEngine properties)
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO,
            });

            // result.tracks is actually returned to array (verify the result length)
            if (result.tracks.length === 0)
                return interaction.editReply('No results');

            // else take the track 1 from the result
            const song = result.tracks[0];
            // then add the song to the queue
            await queue.addTrack(song);

            embed
                // You can easily set the song title and url based on the variable you declared above
                .setDescription(
                    `**[${song.title}](${song.url})** has been added to the queue.`
                )
                // You can also set the thumbnail based on the variable too!
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` });
        } else if (interaction.options.getSubcommand() === 'playlist') {
            // Grab the addStringOption name/string
            let url = interaction.options.getString('url');
            // Using discord-player search function (able to change the searchEngine properties)
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST,
            });

            // result.tracks is actually returned to array (verify the result length)
            if (result.tracks.length === 0)
                return interaction.editReply('No results');

            // else take the playlist from the result
            const playlist = result.playlist;
            // then add the song to the queue (noticed it uses addTrack(s) instead of addTrack)
            await queue.addTracks(result.tracks);

            embed
                // You can easily set the playlist title and url based on the variable you declared above
                .setDescription(
                    `**${result.tracks.length} songs from [${playlist.title}](${playlist.url})** has been added to the queue.`
                )
                // You can also set the thumbnail based on the variable too!
                .setThumbnail(playlist.thumbnail);
        } else if (interaction.options.getSubcommand() === 'search') {
            // Grab the addStringOption name/string
            let url = interaction.options.getString('keywords');
            // Using discord-player search function (able to change the searchEngine properties)
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            // result.tracks is actually returned to array (verify the result length)
            if (result.tracks.length === 0)
                return interaction.editReply('No results');

            // else take the song from the result
            const song = result.tracks[0];
            // then add the song to the queue
            await queue.addTrack(song);

            embed
                // You can easily set the song title and url based on the variable you declared above
                .setDescription(
                    `**[${song.title}](${song.url})** has been added to the queue.`
                )
                // You can also set the thumbnail based on the variable too!
                .setThumbnail(song.thumbnail)
                .setFooter({ text: `Duration: ${song.duration}` });
        }

        // if the queue is not playing, play the queue
        if (!queue.playing) await queue.play();

        // and reply to the channel the embeds that has been created
        await interaction.editReply({
            embeds: [embed],
        });
    },
};
