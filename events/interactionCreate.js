const { Events } = require( 'discord.js' );
const Sequelize = require( 'sequelize' );
const dayjs = require( 'dayjs' );
const { Op } = require( 'sequelize' );

module.exports = {
	name: Events.InteractionCreate,
	async execute ( interaction ) {
		if ( interaction.isChatInputCommand() ) {
			const command = interaction.client.commands.get( interaction.commandName );

			if ( !command ) {
				console.error( `No command matching ${ interaction.commandName } was found.` );
				return;
			}

			try {
				await command.execute( interaction );
			} catch ( error ) {
				console.error( `Error executing ${ interaction.commandName }` );
				console.error( error );
			}
		}

		if ( interaction.isModalSubmit() ) {
			const isNumeric = ( str ) => /^\d+$/.test( str )
			if ( interaction.customId === 'saleModal' ) {
				const pphsSold = interaction.fields.getTextInputValue( 'pphsSold' );
				const ovSold = interaction.fields.getTextInputValue( 'ovSold' );
				const dpSold = interaction.fields.getTextInputValue( 'dpSold' );
				const revenueSold = interaction.fields.getTextInputValue( 'revenueSold' );
				const totalRevenueSold = parseInt( dpSold ) + parseInt( revenueSold )
				const sales = interaction.client.db.sales

				if ( !isNumeric( pphsSold ) || !isNumeric( ovSold ) || !isNumeric( revenueSold ) ) {
					await interaction.reply( `Please try again! Hint: Only numbers are accepted for this command.` )
					return;
				}

				try {
					const salesrow = await sales.create( {
						uid: interaction.user.id,
						pphs: pphsSold,
						ov: ovSold,
						revenue: totalRevenueSold,
					} );
					await interaction.reply( { content: `New sales added for ${ interaction.user }` } );
				}
				catch ( error ) {
					console.error( error )
				}

			} else if ( interaction.customId === 'quotaModal' ) {
				const pphsQUOTA = interaction.fields.getTextInputValue( 'pphsQUOTA' );
				const ovQUOTA = interaction.fields.getTextInputValue( 'ovQUOTA' );
				const revenueQUOTA = interaction.fields.getTextInputValue( 'revenueQUOTA' );

				if ( !isNumeric( pphsQUOTA ) || !isNumeric( ovQUOTA ) || !isNumeric( revenueQUOTA ) ) {
					await interaction.reply( `Please try again! Hint: Only numbers are accepted for this command.` )
					return;
				}
				const [ quotaRow, created ] = await interaction.client.db.quotas.findOrCreate( {
					where: {
						uid: interaction.user.id,
					},
					defaults: {
						pphsquota: pphsQUOTA,
						ovquota: ovQUOTA,
						revenuequota: revenueQUOTA,
					}
				} );

				if ( !created ) {
					// The row wasnt created, only found. so update the rows quota values to the new input

					// Only update values that are different to the database (incase the user didn't fill in one of the boxes)
					if ( quotaRow.dataValues.pphsquota != pphsQUOTA ) {
						quotaRow.pphsquota = pphsQUOTA;
					}

					if ( quotaRow.dataValues.ovquota != ovQUOTA ) {
						quotaRow.ovquota = ovQUOTA;
					}

					if ( quotaRow.dataValues.revenuequota != revenueQUOTA ) {
						quotaRow.revenuequota = revenueQUOTA;
					}
					await quotaRow.save();
				}
				await interaction.reply( `${ dayjs().format( 'MMMM' ) }'s quotas updated for ${ interaction.user }` )


			}
		}

		if ( interaction.isButton() ) {
			const deleteRow = await interaction.client.db.sales.destroy( {
				where: {
					id: interaction.customId,
					uid: interaction.user.id
				}
			} );
			if ( !deleteRow ) return;
			return interaction.reply( `Sale #${ interaction.customId } has been removed from ${ interaction.user }` );
		}
	}
}
