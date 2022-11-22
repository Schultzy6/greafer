const { ActionRowBuilder, ModalBuilder, TextInputBuilder } = require( '@discordjs/builders' );
const { SlashCommandBuilder, TextInputStyle } = require( 'discord.js' );

module.exports = {
    // The slash command data (name, description, arguments, etc)
    data: new SlashCommandBuilder()
        .setName( 'sale' )
        .setDescription( 'Input a new sale' ),

    // The actual code to be executed every time the command is invoked
    async execute ( interaction ) {

        const modal = new ModalBuilder()
            .setCustomId( 'saleModal' )
            .setTitle( 'New Sales:' )

        const pphsSold = new TextInputBuilder()
            .setCustomId( 'pphsSold' )
            .setLabel( 'How many postpaid handsets did you sell?' )
            .setStyle( TextInputStyle.Short )
            .setPlaceholder( '0' )
            .setValue( '0' )
            .setRequired( false )
        const ovSold = new TextInputBuilder()
            .setCustomId( 'ovSold' )
            .setLabel( 'How much other volume did you sell?' )
            .setStyle( TextInputStyle.Short )
            .setPlaceholder( '0' )
            .setValue( '0' )
            .setRequired( false )
        const revenueSold = new TextInputBuilder()
            .setCustomId( 'revenueSold' )
            .setLabel( 'How much revenue did you sell?' )
            .setStyle( TextInputStyle.Short )
            .setPlaceholder( '0' )
            .setValue( '0' )
            .setRequired( false )
        const dpSold = new TextInputBuilder()
            .setCustomId( 'dpSold' )
            .setLabel( 'DP Sold?\nDp+ $50/Dp Standard $25/Basic $15' )
            .setStyle( TextInputStyle.Short )
            .setPlaceholder( '0' )
            .setValue( '0' )
            .setRequired( false )

        const firstActionRow = new ActionRowBuilder().addComponents( pphsSold );
        const secondActionRow = new ActionRowBuilder().addComponents( ovSold );
        const thirdActionRow = new ActionRowBuilder().addComponents( revenueSold );
        const fourthActionRow = new ActionRowBuilder().addComponents( dpSold );

        // Add inputs to the modal
        modal.addComponents( firstActionRow, secondActionRow, thirdActionRow, fourthActionRow );
        // Show the modal to the user
        await interaction.showModal( modal );
    },
};