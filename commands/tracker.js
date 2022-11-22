const dayjs = require( 'dayjs' );
const customParseFormat = require( 'dayjs/plugin/customParseFormat' );
dayjs.extend( customParseFormat );
const { SlashCommandBuilder, EmbedBuilder } = require( 'discord.js' );
const Sequelize = require( 'sequelize' );
const { Op } = require( 'sequelize' );

module.exports = {
    // The slash command data (name, description, arguments, etc)
    data: new SlashCommandBuilder()
        .setName( 'tracker' )
        .setDescription( 'Sales Tracker' )
        .addStringOption( option =>
            option.setName( 'date' )
                .setRequired( false )
                .setDescription( 'What month would you like to check sales for? (MM-YYYY format, ie: 02-2021, 12-2022, etc' ) ),

    // The actual code to be executed every time the command is invoked
    async execute ( interaction ) {
        const userDateInput = interaction.options.getString( 'date' );
        const inputDate = userDateInput ? dayjs( userDateInput, 'MM-YYYY' ) : dayjs();

        // Select SUM's of each sale column, across all rows during the input month
        const sales = await interaction.client.db.sales.findAll( {
            attributes: [
                'id', 'uid', 'pphs', 'ov', 'revenue',
                [ Sequelize.fn( 'SUM', Sequelize.col( 'pphs' ) ), 'pphsSum' ],
                [ Sequelize.fn( 'SUM', Sequelize.col( 'ov' ) ), 'ovSum' ],
                [ Sequelize.fn( 'SUM', Sequelize.col( 'revenue' ) ), 'revenueSum' ]
            ],
            where: {
                uid: interaction.user.id,
                createdAt: {
                    [ Op.between ]: [ inputDate.startOf( 'month' ).format( 'YYYY-MM-DD' ), inputDate.endOf( 'month' ).format( 'YYYY-MM-DD' ) ]
                }
            }
        } );


        // Select users quota row for the month
        const quotas = await interaction.client.db.quotas.findAll( {
            where: {
                uid: interaction.user.id,
                createdAt: {
                    [ Op.between ]: [ inputDate.startOf( 'month' ).format( 'YYYY-MM-DD' ), inputDate.endOf( 'month' ).format( 'YYYY-MM-DD' ) ]
                }
            }
        } );
        // Create & format embed
        function isWhatPercentOf ( numA, numB ) {
            return ( numA / numB ) * 100;
        }
        const pacingPPHS = isWhatPercentOf( sales[ 0 ].dataValues.pphsSum, quotas[ 0 ].dataValues.pphsquota ).toFixed( 2 );
        const pacingOV = isWhatPercentOf( sales[ 0 ].dataValues.ovSum, quotas[ 0 ].dataValues.ovquota ).toFixed( 2 );
        const pacingRevenue = isWhatPercentOf( sales[ 0 ].dataValues.revenueSum, quotas[ 0 ].dataValues.revenuequota ).toFixed( 2 );

        const exampleEmbed = new EmbedBuilder()
            .setColor( 0x008000 )
            .setTitle( `${ dayjs().format( 'MMMM' ) }'s Sales` )
            .setAuthor( { name: `${ interaction.user.username }`, iconURL: `${ interaction.user.displayAvatarURL() }` } )
            .setThumbnail( 'https://i.imgur.com/bccPOY9.png' )
            .setTimestamp()

        if ( !sales[ 0 ].dataValues.id || !sales || !sales[ 0 ] ) {
            await interaction.reply( 'There is no data for the inputted month!' );
            return;
        }

        exampleEmbed.addFields(
            { name: 'Postpaid Handsets Sold:', value: `${ sales[ 0 ].dataValues.pphsSum }`, inline: true },
            { name: 'Other Volume Sold:', value: `${ sales[ 0 ].dataValues.ovSum }`, inline: true },
            { name: 'Revenue Sold:', value: `$${ sales[ 0 ].dataValues.revenueSum }`, inline: true },
            { name: 'Pacing PPHS:', value: `${ pacingPPHS }%`, inline: true },
            { name: 'Pacing OV:', value: `${ pacingOV }%`, inline: true },
            { name: 'Pacing Revenue:', value: `${ pacingRevenue }%`, inline: true },
            { name: 'Postpaid Handset Quota:', value: `${ quotas[ 0 ].dataValues.pphsquota }`, inline: true },
            { name: 'Other Volume Quota:', value: `${ quotas[ 0 ].dataValues.ovquota }`, inline: true },
            { name: 'Revenue Quota:', value: `$${ quotas[ 0 ].dataValues.revenuequota }`, inline: true },
        );

        await interaction.reply( { embeds: [ exampleEmbed ] } );
    },
};