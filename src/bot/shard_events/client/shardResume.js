module.exports = {
	name: "shardResume",
	run: (id, replayedEvents, client) => {
		client.logger.info(
			`[BOT] > Shard ${id} resumed | ${replayedEvents} replayed events`
		);
	},
};
