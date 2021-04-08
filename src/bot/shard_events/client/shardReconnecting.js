module.exports = {
	name: "shardReconnecting",
	run: (id, client) => {
		client.logger.info(`[BOT] > Shard ${id} reconnecting`);
	},
};
