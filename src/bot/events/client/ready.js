const ms = require("ms");
module.exports = {
	name: "ready",
	run: (client) => {
		client.manager.init(client.user.id);
		client.logger.success(`[BOT] > ${client.user.tag} has logged in`);
		Presence(client);
		setInterval(() => {
			Presence();
			client.logger.info(`[BOT] > Presence updated: ${servers}`);
		}, ms("15m"));
	},
};

function Presence(client) {
	const servers =
		client.guilds.cache.size > 1
			? `${client.guilds.cache.size} servers`
			: `1 server`;
	return client.user.setPresence({
		activity: {
			name: `g?help | ${servers}`,
			type: "LISTENING",
		},
		status: "online",
	});
}
