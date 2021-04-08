module.exports = {
	name: "guildCreate",
	run: async (client) => {
		const servers =
			client.guilds.cache.size > 1
				? `${client.guilds.cache.size} servers`
				: `1 server`;
		client.user.setPresence({
			activity: {
				name: `g?help | ${servers}`,
				type: "STREAMING",
				url: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, //get noobed
			},
			status: "online",
		});
	},
};
