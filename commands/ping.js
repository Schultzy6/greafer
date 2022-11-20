const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	// The slash command data (name, description, arguments, etc)
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),

	// The actual code to be executed every time the command is invoked
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};