module.exports = {
	name: "avatar",
	category: "utility",
	run: async (client, message, args) => {
		const target =
			message.mentions.users.first() ||
			client.users.cache.find((user) => user.id === args[0]) ||
			message.author;
		const sizes = [16, 32, 64, 128, 256, 512, 1024, 2048, 4096];
		const formats = ["webp", "png", "jpeg", "gif"];

		let webpText = "";
		let pngText = "";
		let jpegText = "";
		let gifText = "";

		formats.forEach((format) => {
			sizes.forEach((size) => {
				if (format === "png")
					pngText +=
						size === 4096
							? `[${size}](${target.displayAvatarURL({
									format: format,
									size: size,
							  })})`
							: `[${size}](${target.displayAvatarURL({
									format: format,
									size: size,
							  })}) | `;
				if (format === "jpeg")
					jpegText +=
						size === 4096
							? `[${size}](${target.displayAvatarURL({
									format: format,
									size: size,
							  })})`
							: `[${size}](${target.displayAvatarURL({
									format: format,
									size: size,
							  })}) | `;
				if (format === "webp")
					webpText +=
						size === 4096
							? `[${size}](${target.displayAvatarURL({
									format: format,
									size: size,
							  })})`
							: `[${size}](${target.displayAvatarURL({
									format: format,
									size: size,
							  })}) | `;
				if (format === "gif")
					gifText +=
						size === 4096
							? `[${size}](${target.displayAvatarURL({
									format: format,
									size: size,
									dynamic: true,
							  })})`
							: `[${size}](${target.displayAvatarURL({
									format: format,
									size: size,
									dynamic: true,
							  })}) | `;
			});
		});

		return message.channel.send(
			client.embed(
				{
					title: "Choose your desired file format and size",
					fields: [
						{
							name: titleCase(formats[0]),
							value: webpText,
						},
						{
							name: titleCase(formats[1]),
							value: pngText,
						},
						{
							name: titleCase(formats[2]),
							value: jpegText,
						},
						{
							name: titleCase(formats[3]),
							value: gifText,
						},
					],
					thumbnail: {
						url: target.displayAvatarURL({
							format: "gif",
							dynamic: true,
							size: 512,
						}),
					},
				},
				message
			)
		);
	},
};

function titleCase(str) {
	return str
		.toLowerCase()
		.split(/ +/g)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}
