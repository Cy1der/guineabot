module.exports = {
	name: "shardDisconnect",
	run: (event, id, client) => {
		client.logger.info(
			`[BOT] > Shard ${id} disconnected | Error code: ${
				event.code
			} | Reason: ${event.reason} | Clean? ${
				event.wasClean ? "yes" : "no"
			}`
		);
	},
};
