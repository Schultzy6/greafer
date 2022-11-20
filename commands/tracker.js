const { ActionRowBuilder, ModalBuilder, TextInputBuilder } = require( '@discordjs/builders' );
const { SlashCommandBuilder, EmbedBuilder } = require( 'discord.js' );

module.exports = {
    // The slash command data (name, description, arguments, etc)
    data: new SlashCommandBuilder()
        .setName( 'tracker' )
        .setDescription( 'Sales Tracker' ),

    // The actual code to be executed every time the command is invoked
    async execute ( interaction ) {
        const userTag = interaction.user.username
        const exampleEmbed = new EmbedBuilder()
            .setColor( 0x0099FF )
            .setTitle( `${ userTag }'s Monthly Sales ` )
            .setURL( 'https://discord.js.org/' )
            .setAuthor( { name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' } )
            .setDescription( 'Some description here' )
            .setThumbnail( 'https://i.imgur.com/AfFp7pu.png' )
            .addFields(
                { name: 'Regular field title', value: 'Some value here' },
                { name: '\u200B', value: '\u200B' },
                { name: 'Inline field title', value: 'Some value here', inline: true },
                { name: 'Inline field title', value: 'Some value here', inline: true },
            )
            .addFields( { name: 'Inline field title', value: 'Some value here', inline: true } )
            .setImage( 'https://i.imgur.com/AfFp7pu.png' )
            .setTimestamp()
            .setFooter( { text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' } );

        interaction.reply( { embeds: [ exampleEmbed ] } );
    },
};