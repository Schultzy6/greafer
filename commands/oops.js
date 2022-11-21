const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require( '@discordjs/builders' );
const { SlashCommandBuilder, ButtonStyle } = require( 'discord.js' );

module.exports = {
    // The slash command data (name, description, arguments, etc)
    data: new SlashCommandBuilder()
        .setName( 'oops' )
        .setDescription( 'Lets you remove any of your last 5 sales' ),

    // The actual code to be executed every time the command is invoked
    async execute ( interaction ) {

        const saleRows = await interaction.client.db.sales.findAll( {
            limit: 5,
            where: { uid: interaction.user.id },
            order: [ [ 'createdAt', 'DESC' ] ]
        } );
        console.log( saleRows )
        if ( saleRows.length === 0 ) {
            await interaction.reply( 'There are no sales to remove!' );
            return;
        }
        const buttonRow = new ActionRowBuilder()
        const exampleEmbed = new EmbedBuilder()
            .setColor( 0xFF0000 )
            .setTitle( `Latest Sales:` )
            .setAuthor( { name: `${ interaction.user.username }`, iconURL: `${ interaction.user.displayAvatarURL() }` } )
            .setTimestamp()
            .setThumbnail( 'https://i.imgur.com/bccPOY9.png' )

        let lastFiveStr = '';
        saleRows.forEach( row => {
            lastFiveStr += `${ row.id } => ${ row.dataValues.pphs } pphs, ${ row.dataValues.ov } ov, ${ row.dataValues.revenue } revenue\n`
            exampleEmbed.addFields( { name: `*Sale ${ row.id }*`, value: `PPHS: ${ row.dataValues.pphs }\nOV: ${ row.dataValues.ov }\nRevenue: $${ row.dataValues.revenue }`, inline: true } )
            buttonRow.addComponents(
                new ButtonBuilder()
                    .setCustomId( `${ row.id }` )
                    .setLabel( `Remove Sale ${ row.id }` )
                    .setStyle( ButtonStyle.Danger )
            );
        } );
        interaction.reply( { embeds: [ exampleEmbed ], components: [ buttonRow ] } );
    },
};