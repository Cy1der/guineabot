module.exports = {
	name: "nodeConnect",
	run: (client, node) => {
		client.logger.info(
			`[BOT] > ${node.options.identifier} connected to Lavalink websocket`
		);
	},
};
