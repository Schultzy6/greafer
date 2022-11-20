const { ActionRowBuilder, ModalBuilder, TextInputBuilder } = require( '@discordjs/builders' );
const { SlashCommandBuilder, TextInputStyle } = require( 'discord.js' );

module.exports = {
    // The slash command data (name, description, arguments, etc)
    data: new SlashCommandBuilder()
        .setName( 'revenue' )
        .setDescription( 'Revnue Sold' ),

    // The actual code to be executed every time the command is invoked
    async execute ( interaction ) {

        const modal = new ModalBuilder()
            .setCustomId( 'myRevenueModal' )
            .setTitle( 'Revenue Sold:' )

        const revenueAmount = new TextInputBuilder()
            .setCustomId( 'revenueAmount' )
            // The label is the prompt the user sees for this input
            .setLabel( "How much did you sell in revenue?" )
            .setStyle( TextInputStyle.Short );

        const revenueSold = new ActionRowBuilder().addComponents( revenueAmount );
        // Add inputs to the modal
        modal.addComponents( revenueSold );
        // Show the modal to the user
        await interaction.showModal( modal );
    },
};