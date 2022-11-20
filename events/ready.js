const { Events } = require( 'discord.js' );

module.exports = {
	name: Events.ClientReady,
	once: true, // Only run once (on bot startup)
	execute ( client ) {
		console.log( `Ready! Logged in as ${ client.user.tag }` );
	},
};