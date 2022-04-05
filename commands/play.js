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
        .addStringOption((option) =>
            option
                .setName('any')
                .setDescription('Load songs from any sources via URL')
                .setRequired(true)
        ),
    run: async ({ client, interaction }) => {
        // Validating if user is in the voice channel
        if (!interaction.member.voice.channel)
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#EFAAC4')
                        .setAuthor({
                            name: 'Warning!',
                            iconURL: 'https://i.imgur.com/ACiGc2A.png',
                        })
                        .setTitle(
                            ':warning: — You need to be in a voice channel to use Rabbito.'
                        ),
                ],
            });

        const queue = await client.player.createQueue(interaction.guild, {
            initialVolume: 30,
            leaveOnEnd: false,
            volumeSmoothness: false,
        });

        if (!queue.connection)
            await queue.connect(interaction.member.voice.channel);

        // Declaration of embed message
        let embed = new MessageEmbed();

        // Get any parameter from user
        let any = interaction.options.getString('any');

        // If the URL contains 'playlist'
        if (any.includes('playlist')) {
            // Using discord-player search function (able to change the searchEngine properties)
            const result = await client.player.search(any, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            // result.tracks is actually returned to array (verify the result length)
            if (result.tracks.length === 0)
                return interaction.editReply('No results');

            // else take the playlist from the result
            const playlist = result.playlist;
            // then add the song to the queue (noticed it uses addTrack(s) instead of addTrack)
            await queue.addTracks(result.tracks);

            embed
                .setColor('#EFAAC4')
                .setAuthor({
                    name: 'Success!',
                    iconURL: 'https://i.imgur.com/ACiGc2A.png',
                })
                .setTitle(':arrow_forward: — Added to the queue')
                // You can easily set the playlist title and url based on the variable you declared above
                .setDescription(
                    `**${result.tracks.length} songs from [${playlist.title}](${playlist.url})**`
                )
                // You can also set the thumbnail based on the variable too!
                .setThumbnail(playlist.thumbnail)
                .setFooter({
                    text: "P/S: Only the first 100 songs will be queue if you're using Spotify playlist link, this is a known bug by discord-player itself.",
                });
        } else {
            // Using discord-player search function (able to change the searchEngine properties)
            const result = await client.player.search(any, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            // result.tracks is actually returned to array (verify the result length)
            if (result.tracks.length === 0)
                return interaction.editReply('No results');

            // else take the track 1 from the result
            const song = result.tracks[0];
            // then add the song to the queue
            await queue.addTrack(song);

            embed
                .setColor('#EFAAC4')
                .setAuthor({
                    name: 'Success!',
                    iconURL: 'https://i.imgur.com/ACiGc2A.png',
                })
                .setTitle(':arrow_forward: — Added to the queue')
                // You can easily set the song title and url based on the variable you declared above
                .setDescription(`**[${song.title}](${song.url})**`)
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
