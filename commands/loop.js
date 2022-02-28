// Destructure object properties from discordjs/builder
const { SlashCommandBuilder } = require('@discordjs/builders');
// Destructure object properties from discord.js
const { MessageEmbed } = require('discord.js');
// Destructure object properties from discord-player
const { QueueRepeatMode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Set the loop mode of the music')
        .addStringOption((option) =>
            option
                .setName('mode')
                .setDescription('Single song loop or queue loop')
                /* addChoices() method expect an array of object
                for v13, it's in the format of array of tuples
                (didn't learn it when I was learning JavaScript)
                luckily, for v14 it's actually return an array of object
                QueueRepeatMode.* returning number, so change it to string first
                Both name and value need to be string */
                .addChoices([
                    ['off', QueueRepeatMode.OFF.toString()],
                    ['song', QueueRepeatMode.TRACK.toString()],
                    ['queue', QueueRepeatMode.QUEUE.toString()],
                ])
                .setRequired(true)
        ),
    run: async ({ client, interaction }) => {
        // Get queue from current guild (server)
        const queue = client.player.getQueue(interaction.guildId);
        // Declaration of embed message
        let embed = new MessageEmbed();

        if (!queue || !queue.playing)
            return await interaction.editReply(
                'There are no songs in the queue'
            );

        // Return the value of addChoices()
        const input = interaction.options.getString('mode');

        // Convert the value to integer & accessing the value of addChoices()
        const loopMode = parseInt(interaction.options.get('mode').value);

        // Set the loopMode based on the input given
        if (input === QueueRepeatMode.OFF.toString()) {
            queue.setRepeatMode(loopMode);
            embed.setDescription('Loop has been set to **OFF**');
        } else if (input === QueueRepeatMode.TRACK.toString()) {
            queue.setRepeatMode(loopMode);
            embed.setDescription('Loop has been set to **SONG**');
        } else if (input === QueueRepeatMode.QUEUE.toString()) {
            queue.setRepeatMode(loopMode);
            embed.setDescription('Loop has been set to **QUEUE**');
        }

        await interaction.editReply({
            embeds: [embed],
        });
    },
};
