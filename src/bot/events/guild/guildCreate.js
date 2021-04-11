module.exports = {
	name: "guildCreate",
	run: async (client, guild) => {
		client.logger.info(`[BOT] > Joined guild "${guild.name}" (${guild.id})`)
	},
};
