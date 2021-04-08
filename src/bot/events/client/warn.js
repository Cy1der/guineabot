module.exports = {
	name: "warn",
	run: (client, data) => {
		client.logger.warn(`[BOT] > ${data}`);
	},
};
