const { MessageEmbed } = require("discord.js");
const prettyms = require("pretty-ms");
module.exports = {
	name: "trackStart",
	run: (client, player, track) => {
		const channel = client.channels.cache.get(player.textChannel);
		const embed = new MessageEmbed({
			title: "Now Playing",
			description: `**Track:** ${track.title}\n**Author:** ${
				track.author
			}\n**Duration:** ${
				track.isStream
					? "Live"
					: prettyms(track.duration, {
							verbose: true,
							separateMilliseconds: true,
							formatSubMilliseconds: true,
							secondsDecimalDigits: 0,
					  })
			}`,
			thumbnail: {
				url: track.thumbnail,
			},
			url: track.uri,
		});
		channel.send(embed);
	},
};
