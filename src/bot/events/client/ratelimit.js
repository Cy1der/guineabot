module.exports = {
	name: "rateLimit",
	run: (client, data) => {
		client.logger.error(`[BOT] > ${JSON.stringify(data, null, 4)}`);
	},
};
