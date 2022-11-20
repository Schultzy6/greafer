const { Events } = require( 'discord.js' );
const Sequelize = require( 'sequelize' );

module.exports = {
	name: Events.InteractionCreate,
	async execute ( interaction ) {
		// If the interaction is a plain old command interaction, handle it as such
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

		// If the interaction is a response to a select menu, handle it accordingly
		if ( interaction.isModalSubmit() ) {
			const isNumeric = ( str ) => /^\d+$/.test( str )
			const SalesDB = interaction.client.db.sales
			if ( interaction.customId === 'myQuotaModal' ) {
				const pphsQuota = interaction.fields.getTextInputValue( 'pphsQUOTA' );
				const ovQuota = interaction.fields.getTextInputValue( 'ovQUOTA' );
				const revenueQuota = interaction.fields.getTextInputValue( 'revenueQUOTA' );

				if ( !isNumeric( pphsQuota ) || !isNumeric( ovQuota ) || !isNumeric( revenueQuota ) ) {
					await interaction.reply( `Please try again! Hint: Only numbers are accepted for this command.` )
					return;
				}

				try {
					// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
					const OVTAG = await SalesDB.create( {
						Username: interaction.user.username,
						PPHSQUOTA: pphsQuota,
						OVQUOTA: ovQuota,
						REVENUEQUOTA: revenueQuota,
					} );
					await interaction.reply( { content: `Monthly quotas updated for ${ interaction.user }` } );

				}
				catch ( error ) {
					if ( error.name === 'SequelizeUniqueConstraintError' ) {
						const nameTag = interaction.user.username
						const updateQUOTA = await SalesDB.findOne( { where: { Username: nameTag } } )
						const quotaPPHS = interaction.fields.getTextInputValue( 'pphsQUOTA' )
						const quotaOV = interaction.fields.getTextInputValue( 'ovQUOTA' )
						const quotaREVENUE = interaction.fields.getTextInputValue( 'revenueQUOTA' )

						if ( updateQUOTA ) {
							updateQUOTA.update( { PPHSQUOTA: quotaPPHS, OVQUOTA: quotaOV, REVENUEQUOTA: quotaREVENUE }, { where: { Username: nameTag } } );
							await interaction.reply( { content: `Monthly quotas updated for ${ interaction.user }` } );

						}
					}

				}
			}

			// This is a simple helper function to test if a string contains only numeric characters


			if ( interaction.customId === 'myOVModal' ) {
				const ovSold = interaction.fields.getTextInputValue( 'ovAmount' )

				if ( !isNumeric( ovSold ) ) {
					await interaction.reply( `Please try again! Hint: Only numbers are accepted for this command.` )
					return;
				}

				try {
					// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
					const OVTAG = await SalesDB.create( {
						Username: interaction.user.username,
						OV: ovSold,
					} );
					await interaction.reply( { content: `${ interaction.fields.getTextInputValue( 'ovAmount' ) } Other Volume added to the database for ${ interaction.user }` } );

				}
				catch ( error ) {
					if ( error.name === 'SequelizeUniqueConstraintError' ) {
						const nameTag = interaction.user.username
						const updateOv = await SalesDB.findOne( { where: { Username: nameTag } } )
						const soldOV = interaction.fields.getTextInputValue( 'ovAmount' )

						if ( updateOv ) {
							updateOv.increment( 'OV', { by: soldOV } )
						}
					}

					await interaction.reply( { content: `${ interaction.fields.getTextInputValue( 'ovAmount' ) } Other Volume added to the database for ${ interaction.user }` } );
				}
			}
			else if ( interaction.customId === 'myPPHSModal' ) {
				const pphsSold = interaction.fields.getTextInputValue( 'pphsAmount' )

				if ( !isNumeric( pphsSold ) ) {
					await interaction.reply( `Please try again! Hint: Only numbers are accepted for this command.` )
					return;
				}
				try {
					// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
					const PPHSTAG = await SalesDB.create( {
						Username: interaction.user.username,
						PPHS: pphsSold,
					} );
					await interaction.reply( { content: `${ interaction.fields.getTextInputValue( 'pphsAmount' ) } Postpaid Handsets added to the database for ${ interaction.user }` } );

				}
				catch ( error ) {
					if ( error.name === 'SequelizeUniqueConstraintError' ) {
						const nameTag = interaction.user.username
						const updatePPHS = await SalesDB.findOne( { where: { Username: nameTag } } )
						const soldPPHS = interaction.fields.getTextInputValue( 'pphsAmount' )

						if ( updatePPHS ) {
							updatePPHS.increment( 'PPHS', { by: soldPPHS } )
						}
					}

					await interaction.reply( { content: `${ interaction.fields.getTextInputValue( 'pphsAmount' ) } Postpaid Handsets added to the database for ${ interaction.user }` } );
				}
			}
			else if ( interaction.customId === 'myRevenueModal' ) {
				const revenueSold = interaction.fields.getTextInputValue( 'revenueAmount' )

				if ( !isNumeric( revenueSold ) ) {
					await interaction.reply( `Please try again! Hint: Only numbers are accepted for this command.` )
					return;
				}
				try {
					// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
					const REVENUETAG = await SalesDB.create( {
						Username: interaction.user.username,
						Revenue: revenueSold,
					} );
					await interaction.reply( { content: `$${ interaction.fields.getTextInputValue( 'revenueAmount' ) } in Revenue added to the database for ${ interaction.user }` } );

				}
				catch ( error ) {
					if ( error.name === 'SequelizeUniqueConstraintError' ) {
						const nameTag = interaction.user.username
						const updateREVENUE = await SalesDB.findOne( { where: { Username: nameTag } } )
						const soldREVENUE = interaction.fields.getTextInputValue( 'revenueAmount' )

						if ( updateREVENUE ) {
							updateREVENUE.increment( 'Revenue', { by: soldREVENUE } )
						}
					}

					await interaction.reply( { content: `$${ interaction.fields.getTextInputValue( 'revenueAmount' ) } in Revenue added to the database for ${ interaction.user }` } );
				}

			}
		}
	},
};
