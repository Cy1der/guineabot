module.exports = {
	name: "guildDelete",
	run: async (client, guild) => {
		client.logger.info(`[BOT] > Left guild "${guild.name}" (${guild.id})`);
	},
};
