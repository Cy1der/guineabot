module.exports = {
	name: "shardReady",
	run: (id, client) => {
		client.logger.success(`[BOT] > Shard ${id} ready`);
	},
};
