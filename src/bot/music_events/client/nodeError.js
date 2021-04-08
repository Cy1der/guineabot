module.exports = {
	name: "nodeError",
	run: (client, node, error) => {
		client.logger.error(
			`[BOT] > ${node.options.identifier} crashed: ${error.message}`
		);
	},
};
