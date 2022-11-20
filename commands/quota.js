const { ActionRowBuilder, ModalBuilder, TextInputBuilder } = require( '@discordjs/builders' );
const { SlashCommandBuilder, TextInputStyle } = require( 'discord.js' );

module.exports = {
    // The slash command data (name, description, arguments, etc)
    data: new SlashCommandBuilder()
        .setName( 'quota' )
        .setDescription( 'Set quota for the month' ),

    // The actual code to be executed every time the command is invoked
    async execute ( interaction ) {

        const modal = new ModalBuilder()
            .setCustomId( 'myQuotaModal' )
            .setTitle( 'Current Months Quotas:' )

        const pphsQuota = new TextInputBuilder()
            .setCustomId( 'pphsQUOTA' )
            // The label is the prompt the user sees for this input
            .setLabel( "PPHS Quota?" )
            .setStyle( TextInputStyle.Short )
            .setRequired( true );

        const ovQuota = new TextInputBuilder()
            .setCustomId( 'ovQUOTA' )
            // The label is the prompt the user sees for this input
            .setLabel( "OV Quota?" )
            .setStyle( TextInputStyle.Short )
            .setRequired( true );

        const revenueQuota = new TextInputBuilder()
            .setCustomId( 'revenueQUOTA' )
            // The label is the prompt the user sees for this input
            .setLabel( "Revenue Quota?" )
            .setStyle( TextInputStyle.Short )
            .setRequired( true );

        const firstActionRow = new ActionRowBuilder().addComponents( pphsQuota );
        const secondActionRow = new ActionRowBuilder().addComponents( ovQuota );
        const thirdActionRow = new ActionRowBuilder().addComponents( revenueQuota );
        // Add inputs to the modal
        modal.addComponents( firstActionRow, secondActionRow, thirdActionRow );
        // Show the modal to the user
        await interaction.showModal( modal );
    },
};