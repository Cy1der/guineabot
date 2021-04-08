module.exports = {
	name: "shardError",
	run: (error, shardID, client) => {
		client.logger.error(
			`[BOT] > Shard ${shardID} connection error | Message: ${error.message}`
		);
	},
};
