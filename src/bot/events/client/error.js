module.exports = {
	name: "error",
	run: (client, data) => {
		client.logger.error(`[BOT] > ${data}`);
	},
};
