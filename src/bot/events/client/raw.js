module.exports = {
	name: "raw",
	run: (client, d) => {
		client.manager.updateVoiceState(d);
	},
};
