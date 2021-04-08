const { MessageEmbed } = require("discord.js");
module.exports = {
	name: "queueEnd",
	run: (client, player) => {
		const channel = client.channels.cache.get(player.textChannel);
		const embed = new MessageEmbed({
			title: "Queue Ended",
			description: "Play a track to continue",
		});
		channel.send(embed);
		player.destroy();
	},
};
