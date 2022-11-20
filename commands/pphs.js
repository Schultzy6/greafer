const { ActionRowBuilder, ModalBuilder, TextInputBuilder } = require( '@discordjs/builders' );
const { SlashCommandBuilder, TextInputStyle } = require( 'discord.js' );

module.exports = {
    // The slash command data (name, description, arguments, etc)
    data: new SlashCommandBuilder()
        .setName( 'pphs' )
        .setDescription( 'PPHS Sold' ),

    // The actual code to be executed every time the command is invoked
    async execute ( interaction ) {

        const modal = new ModalBuilder()
            .setCustomId( 'myPPHSModal' )
            .setTitle( 'Postpaid Handsets Sold:' )

        const pphsAmount = new TextInputBuilder()
            .setCustomId( 'pphsAmount' )
            // The label is the prompt the user sees for this input
            .setLabel( "How many new lines did you sell?" )
            .setStyle( TextInputStyle.Short );

        const pphsSold = new ActionRowBuilder().addComponents( pphsAmount );
        // Add inputs to the modal
        modal.addComponents( pphsSold );
        // Show the modal to the user
        await interaction.showModal( modal );
    },
};