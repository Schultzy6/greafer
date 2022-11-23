require( 'dotenv' ).config();
const { Client, Collection, GatewayIntentBits } = require( 'discord.js' );

const fs = require( 'node:fs' );
const path = require( 'node:path' );
const Sequelize = require( 'sequelize' );

// Create a new client instance
const client = new Client( { intents: [ GatewayIntentBits.Guilds ] } );

const eventsPath = path.join( __dirname, 'events' );
const eventFiles = fs.readdirSync( eventsPath ).filter( file => file.endsWith( '.js' ) );

// Iterate over event files, and register them with the client
for ( const file of eventFiles ) {
	const filePath = path.join( eventsPath, file );
	const event = require( filePath );

	if ( event.once ) {
		client.once( event.name, ( ...args ) => event.execute( ...args ) );
	} else {
		client.on( event.name, ( ...args ) => event.execute( ...args ) );
	}
}

/*
	Load/Initialize commands
*/
client.commands = new Collection();

const commandsPath = path.join( __dirname, 'commands' );
const commandFiles = fs.readdirSync( commandsPath ).filter( file => file.endsWith( '.js' ) );

// Iterate over command files, and add them to our collection
for ( const file of commandFiles ) {
	const filePath = path.join( commandsPath, file );
	const command = require( filePath );

	// Add command to our command collection
	if ( 'data' in command && 'execute' in command ) {
		client.commands.set( command.data.name, command );
	} else {
		console.warn( `The command at ${ filePath } is missing a required 'data' or 'execute' property!` );
	}
}

const sequelize = new Sequelize( 'database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
} );

const sales = sequelize.define( 'sales', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	uid: {
		type: Sequelize.STRING,
		unique: false,
	},
	pphs: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	ov: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	revenue: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	upgrades: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	date: {
		type: Sequelize.DATEONLY,
		defaultValue: Sequelize.NOW,
		allowNull: false,
	}
} );

const quotas = sequelize.define( 'quotas', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
	},
	uid: {
		type: Sequelize.STRING,
		unique: false,
	},
	pphsquota: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	ovquota: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	revenuequota: {
		type: Sequelize.INTEGER,
		defaultValue: 0,
		allowNull: false,
	},
	date: {
		type: Sequelize.DATEONLY,
		defaultValue: Sequelize.NOW,
		allowNull: false,
	}

} );

quotas.sync();
sales.sync();
client.db = {
	sales: sales,
	quotas: quotas
	// If you create any other tables, add them here
};

// Log in to Discord with your client's token
client.login( process.env.BOT_TOKEN );