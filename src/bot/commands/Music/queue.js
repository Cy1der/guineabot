const { MessageEmbed } = require("discord.js");
module.exports = {
	name: "queue",
	aliases: ["q"],
	category: "music",
	botPermissions: ["CONNECT", "SPEAK"],
	run: async (client, message, args) => {
		const player = client.manager.players.get(message.guild.id);
		if (!player)
			return message.channel.send(
				client.embed(
					{
						title: "No music is being played!",
					},
					message
				)
			);

		const queue = player.queue;
		const embed = new MessageEmbed().setAuthor(
			`Queue for ${message.guild.name}`
		);
		const multiple = 10;
		const page = args.length && Number(args[0]) ? Number(args[0]) : 1;
		const end = page * multiple;
		const start = end - multiple;
		const tracks = queue.slice(start, end);
		if (queue.current)
			embed.addField(
				"Current",
				`[${queue.current.title}](${queue.current.uri})`
			);
		if (!tracks.length)
			embed.setDescription(
				`No tracks in ${page > 1 ? `page ${page}` : "the queue"}.`
			);
		else
			embed.setDescription(
				tracks
					.map((track, i) => `${start + ++i} - ${track.title}`)
					.join("\n")
			);
		const maxPages = Math.ceil(queue.length / multiple);
		embed.setFooter(
			`Page ${page > maxPages ? maxPages : page} of ${maxPages}`
		);
		return message.channel.send(embed);
	},
};
