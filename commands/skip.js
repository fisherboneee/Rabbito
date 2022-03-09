// Destructure object properties from discordjs/builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Destructure object properties from discord.js
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song'),
    run: async ({ client, interaction }) => {
        // Get queue from current guild (server)
        const queue = client.player.getQueue(interaction.guildId);

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
                            ':warning: — There are no songs in the queue.'
                        ),
                ],
            });

        const currentSong = queue.current;
        // To skip current song
        queue.skip();

        if (currentSong) {
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#EFAAC4')
                        .setAuthor({
                            name: 'Success!',
                            iconURL: 'https://i.imgur.com/ACiGc2A.png',
                        })
                        .setTitle(`:white_check_mark: — Song has been skipped!`)
                        .setDescription(
                            `**[${currentSong.title}](${currentSong.url})**`
                        )
                        .setThumbnail(currentSong.thumbnail)
                        .setFooter({
                            text: `Duration: ${currentSong.duration}`,
                        }),
                ],
            });
        } else {
            return await interaction.editReply({
                embeds: [
                    new MessageEmbed()
                        .setColor('#EFAAC4')
                        .setAuthor({
                            name: 'Warning!',
                            iconURL: 'https://i.imgur.com/ACiGc2A.png',
                        })
                        .setTitle(
                            ':warning: — There are no song(s) playing right now.'
                        ),
                ],
            });
        }
    },
};
