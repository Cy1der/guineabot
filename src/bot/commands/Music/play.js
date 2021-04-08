module.exports = {
	name: "play",
	aliases: ["p"],
	category: "music",
	botPermissions: ["CONNECT", "SPEAK"],
	run: async (client, message, args) => {
		if (!message.member.voice.channel)
			return await message.channel.send(
				client.embed(
					{
						title: "You must be connected to a voice channel!",
					},
					message
				)
			);
		if (message.guild.me.voice.channel) {
			if (
				message.guild.me.voice.channel.id !==
				message.member.voice.channel.id
			)
				return await message.channel.send(
					client.embed(
						{
							title: "I am already connected to a voice channel!",
						},
						message
					)
				);
		}
		if (!args.length)
			return await message.channel.send(
				client.embed(
					{
						title: "Please enter a track title!",
					},
					message
				)
			);

		const { channel } = message.member.voice;
		const player = message.client.manager.create({
			guild: message.guild.id,
			voiceChannel: channel.id,
			textChannel: message.channel.id,
			selfDeafen: true,
		});

		if (player.state !== "CONNECTED") player.connect();

		const search = args.join(" ");
		let res;

		try {
			res = await player.search(search, message.author);
			if (res.loadType === "LOAD_FAILED") {
				if (!player.queue.current) player.destroy();
				throw res.exception;
			}
		} catch (err) {
			return message.channel.send(
				client.embed(
					{
						title: "An error occurred!",
						description:
							"Please report this error to the developer!",
						fields: [
							{ name: "Message", value: `\`${err.message}\`` },
						],
					},
					message
				)
			);
		}

		switch (res.loadType) {
			case "NO_MATCHES":
				if (!player.queue.current) player.destroy();
				return message.channel.send(
					client.embed(
						{
							title: "No results found",
						},
						message
					)
				);
			case "TRACK_LOADED":
				player.queue.add(res.tracks[0]);

				if (!player.playing && !player.paused && !player.queue.size)
					player.play();
				return message.channel.send(
					client.embed(
						{
							title: "Enqueuing Track",
							fields: [
								{
									name: "Name",
									value: `\`\`\`${res.tracks[0].title}\`\`\``,
								},
							],
						},
						message
					)
				);
			case "PLAYLIST_LOADED":
				player.queue.add(res.tracks);

				if (
					!player.playing &&
					!player.paused &&
					player.queue.totalSize === res.tracks.length
				)
					player.play();
				return message.channel.send(
					client.embed(
						{
							title: "Enqueuing Playlist",
							fields: [
								{
									name: "Info",
									value: `\`\`\`Name: ${res.playlist.name}\nTrack Count: ${res.tracks.length}\`\`\``,
								},
							],
						},
						message
					)
				);
			case "SEARCH_RESULT":
				let max = 8,
					collected,
					filter = (m) =>
						m.author.id === message.author.id &&
						/^(\d+|end)$/i.test(m.content);
				if (res.tracks.length < max) max = res.tracks.length;

				const results = res.tracks
					.slice(0, max)
					.map((track, index) => `${++index} - ${track.title}`)
					.join("\n");

				message.channel.send(
					client.embed(
						{
							title: 'Select A Track or "end" to Cancel',
							author: { name: `Enter A Number: (1-${max})` },
							description: results,
						},
						message
					)
				);

				try {
					collected = await message.channel.awaitMessages(filter, {
						max: 1,
						time: 10000,
						errors: ["time"],
					});
				} catch (e) {
					if (!player.queue.current) player.destroy();
					return message.channel.send(
						client.embed(
							{
								title: "You did not provide a selection!",
							},
							message
						)
					);
				}

				const first = collected.first().content;

				if (first.toLowerCase() === "end") {
					if (!player.queue.current) player.destroy();
					return message.channel.send(
						client.embed(
							{
								title: "Selection cancelled",
							},
							message
						)
					);
				}

				const index = Number(first) - 1;

				if (isNaN(index))
					return message.channel.send(
						client.embed(
							{
								title: `Please provive a numerical value!`,
							},
							message
						)
					);

				if (index < 0 || index > max - 1)
					return message.channel.send(
						client.embed(
							{
								title: `The number you provided was too small or too big (1-${max})!`,
							},
							message
						)
					);

				const track = res.tracks[index];
				player.queue.add(track);

				if (!player.playing && !player.paused && !player.queue.size)
					player.play();
				return message.channel.send(
					client.embed(
						{
							title: "Enqueuing Track",
							fields: [
								{
									name: "Name",
									value: `\`\`\`${track.title}\`\`\``,
								},
							],
						},
						message
					)
				);
		}
	},
};
