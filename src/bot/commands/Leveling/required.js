module.exports = {
	name: "required",
	category: "leveling",
	run: async (client, message, args) => {
		const GuildConfigSchema = await client.db.load("guildconfig");
		const GuildConfig = await GuildConfigSchema.findOne({
			Guild: message.guild.id,
		});
		const currentStatus = GuildConfig?.Leveling ?? true;

		if (!currentStatus)
			return message.channel.send(
				client.embed({ title: "Leveling is disabled" }, message)
			);

		if (!args.length)
			return message.channel.send(
				client.embed({ title: "Please enter a number" }, message)
			);
		const level = parseInt(args[0]);
		if (isNaN(level))
			return message.channel.send(
				client.embed(
					{ title: "Number must be a numerical value" },
					message
				)
			);
		const xpFor = client.leveling.xpFor(level);
		return message.channel.send(
			client.embed(
				{
					title: `You need \`${xpFor}\` XP to reach level \`${level}\``,
				},
				message
			)
		);
	},
};
