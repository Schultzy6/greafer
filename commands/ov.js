const { ActionRowBuilder, ModalBuilder, TextInputBuilder } = require( '@discordjs/builders' );
const { SlashCommandBuilder, TextInputStyle } = require( 'discord.js' );

module.exports = {
    // The slash command data (name, description, arguments, etc)
    data: new SlashCommandBuilder()
        .setName( 'ov' )
        .setDescription( 'Other Volume Sold' ),

    // The actual code to be executed every time the command is invoked
    async execute ( interaction ) {

        const modal = new ModalBuilder()
            .setCustomId( 'myOVModal' )
            .setTitle( 'Other Volume Sold:' )

        const ovAmount = new TextInputBuilder()
            .setCustomId( 'ovAmount' )
            // The label is the prompt the user sees for this input
            .setLabel( "How much other volume did you sell?" )
            .setStyle( TextInputStyle.Short );

        const ovSold = new ActionRowBuilder().addComponents( ovAmount );
        // Add inputs to the modal
        modal.addComponents( ovSold );
        // Show the modal to the user
        await interaction.showModal( modal );
    },
};