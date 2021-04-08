module.exports = {
	name: "debug",
	run: (client, data) => {
		client.logger.debug(`[BOT] > ${data}`);
	},
};
