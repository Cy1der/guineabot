const ms = require("ms");
module.exports = {
	name: "help",
	aliases: ["h", "commands", "cmds"],
	category: "information",
	run: async (client, message, args) => {
		const mainEmbed = client.embed(
			{
				title: "Guineabot Help Menu",
				description: `${[...client.categories]
					.map(
						(category) =>
							`**${
								category[0].toUpperCase() +
								category.slice(1).toLowerCase()
							}《${
								client.commands.filter(
									(command) =>
										command.category.toLowerCase() ==
										category.toLowerCase()
								).size
							}》**\n\`${client.commands
								.filter(
									(command) =>
										command.category.toLowerCase() ==
										category.toLowerCase()
								)
								.map((command) => command.name)
								.join("`, `")}\``
					)
					.join("\n\n")}`,
			},
			message
		);
		if (!args.length) return message.channel.send(mainEmbed);
		else {
			const cmd =
				client.commands.get(args[0].toLowerCase()) ||
				client.commands.get(client.aliases.get(args[0].toLowerCase()));
			if (!cmd) return message.channel.send(mainEmbed);
			return message.channel.send(
				client.embed(
					{
						title: `${
							cmd.name[0].toUpperCase() +
							cmd.name.slice(1).toLowerCase()
						} Command`,
						description: Object.entries(cmd)
							.filter((value) => typeof value[1] !== "function")
							.map((value) => {
								const key =
									value[0][0].toUpperCase() +
									value[0].slice(1).toLowerCase();
								if (typeof value[1] == "string")
									return `**${key}:** ${
										value[1][0].toUpperCase() +
										value[1].slice(1).toLowerCase()
									}`;
								else if (typeof value[1] == "number") {
									return `**${key}:** ${ms(value[1], {
										long: true,
									})}`;
								} else if (typeof value[1] == "object") {
									return `**${key}:** ${value[1]
										.map((alias) => {
											return `${
												alias[0].toUpperCase() +
												alias.slice(1).toLowerCase()
											}`;
										})
										.join(", ")}`;
								} else {
									return `**${key}:** ${value[1]}`;
								}
							})
							.join("\n"),
					},
					message
				)
			);
		}
	},
};
