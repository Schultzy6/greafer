const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('@discordjs/builders');
const dayjs = require('dayjs');
const { SlashCommandBuilder, ButtonStyle } = require('discord.js');
const { Sequelize, Op } = require('sequelize');

module.exports = {
  // The slash command data (name, description, arguments, etc)
  data: new SlashCommandBuilder()
    .setName('payout')
    .setDescription('Shows Current Month Payout')
    .addStringOption(option =>
      option.setName('date').setRequired(false).setDescription('What month would you like to check sales for? (MM-YYYY format, ie: 02-2021, 12-2022, etc')
    ),

  // The actual code to be executed every time the command is invoked
  async execute(interaction) {
    const userDateInput = interaction.options.getString('date');
    const inputDate = userDateInput ? dayjs(userDateInput, 'MM-YYYY') : dayjs();

    const sales = await interaction.client.db.sales.findAll({
      attributes: [
        'id',
        'uid',
        'pphs',
        'ov',
        'revenue',
        'upgrades',
        [Sequelize.fn('SUM', Sequelize.col('pphs')), 'pphsSum'],
        [Sequelize.fn('SUM', Sequelize.col('ov')), 'ovSum'],
        [Sequelize.fn('SUM', Sequelize.col('revenue')), 'revenueSum'],
        [Sequelize.fn('SUM', Sequelize.col('upgrades')), 'upgradesSum'],
      ],
      where: {
        uid: interaction.user.id,
        createdAt: {
          [Op.between]: [inputDate.startOf('month').format('YYYY-MM-DD'), inputDate.endOf('month').format('YYYY-MM-DD')],
        },
      },
    });
    const quotas = await interaction.client.db.quotas.findAll({
      where: {
        uid: interaction.user.id,
        createdAt: {
          [Op.between]: [inputDate.startOf('month').format('YYYY-MM-DD'), inputDate.endOf('month').format('YYYY-MM-DD')],
        },
      },
    });

    if (quotas[0] === undefined) {
      await interaction.reply('There is no data for the inputted month please add your quotas first');
      return;
    }
    if (!sales[0].dataValues.id || !sales || !sales[0]) {
      await interaction.reply('There is no data for the inputted month please input a sale first!');
      return;
    }

    const BASE_PAYOUT_PPHS = 312;
    const BASE_PAYOUT_OV = 117;
    const BASE_PAYOUT_REVENUE = 273;

    function evaluatePPHS(sum, quota, threshold = 0.6) {
      const quotaThreshold = quota * threshold;
      if (sum - quotaThreshold >= 0) {
        if (sum - quota >= 0) {
          // user is over their quota
          const amountOver = sum - quota;
          return BASE_PAYOUT_PPHS + amountOver * 85;
        } else {
          return (sum / quota) * BASE_PAYOUT_PPHS;
        }
      }
    }

    function evaluateOV(sum, quota, threshold = 0.6) {
      const quotaThreshold = quota * threshold;
      if (sum - quotaThreshold >= 0) {
        if (sum - quota >= 0) {
          // user is over their quota
          const amountOver = sum - quota;
          return BASE_PAYOUT_OV + amountOver * 25;
        } else {
          // user is in that sweet spot between 60-100
          return (sum / quota) * BASE_PAYOUT_OV;
        }
      }
    }
    function evaluateRevenue(sum, quota, threshold = 0.6) {
      const quotaThreshold = quota * threshold;
      if (sum - quotaThreshold >= 0) {
        if (sum - quota >= 0) {
          // user is over their quota
          const amountOver = sum - quota;
          return BASE_PAYOUT_REVENUE + amountOver * 0.2;
        } else {
          // user is in that sweet spot between 60-100
          return (sum / quota) * BASE_PAYOUT_REVENUE;
        }
      }
    }
    let totalPPHS = evaluatePPHS(sales[0].dataValues.pphsSum, quotas[0].dataValues.pphsquota);
    let totalOV = evaluateOV(sales[0].dataValues.ovSum, quotas[0].dataValues.ovquota);
    let totalREVENUE = evaluateRevenue(sales[0].dataValues.revenueSum, quotas[0].dataValues.revenuequota);
    const totalUpgrades = sales[0].dataValues.upgradesSum * 7.5;
    if (totalPPHS === undefined) {
      totalPPHS = 0;
    }
    if (totalOV === undefined) {
      totalOV = 0;
    }
    if (totalREVENUE === undefined) {
      totalREVENUE = 0;
    }
    const totalPayout = totalPPHS + totalOV + totalREVENUE + totalUpgrades;
    const exampleEmbed = new EmbedBuilder()
      .setColor(0x29ff1a)
      .setTitle(`${dayjs().format('MMMM')}'s Sales`)
      .setAuthor({ name: `${interaction.user.username}`, iconURL: `${interaction.user.displayAvatarURL()}` })
      .setThumbnail('https://i.imgur.com/bccPOY9.png')
      .setTimestamp();

    exampleEmbed.addFields(
      { name: 'PPHS Payout:', value: `$${totalPPHS.toFixed(2)}`, inline: true },
      { name: 'Other Volume Payout:', value: `$${totalOV.toFixed(2)}`, inline: true },
      { name: 'Revenue Payout:', value: `$${totalREVENUE.toFixed(2)}`, inline: true },
      { name: 'Upgrades/Flat Rate Payout:', value: `$${totalUpgrades.toFixed(2)}`, inline: true },
      { name: 'Total Estimated Payout:', value: `$${totalPayout.toFixed(2)}`, inline: true }
    );

    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
