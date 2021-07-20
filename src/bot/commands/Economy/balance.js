module.exports = {
	name: "balance",
	aliases: ["bal"],
	category: "economy",
	run: async (client, message, args) => {
		const target =
			message.mentions.users.first() ||
			client.users.cache.get(args[0]) ||
			message.author;

		const UserEconomySchema = await client.db.load("userEconomy");
		let UserEconomy = await UserEconomySchema.findOne({
			User: target.id,
		});

		const now = Date.now();

		if (!UserEconomy)
			UserEconomy = await UserEconomySchema.update(
				{ User: message.author.id },
				{
					User: target.id,
					Wallet: 0,
					Bank: 0,
					Multi: 1,
					Job: "Unemployed",
					JobCooldown: now,
					DailyCooldown: now,
					WeeklyCooldown: now,
					WorkCooldown: now,
					RobCooldown: now,
					BankrobCooldown: now,
					LotteryCooldown: now,
					PMCooldown: now,
					Inventory: [],
				}
			);

		const wallet = UserEconomy?.Wallet ?? 0;
		const bank = UserEconomy?.Bank ?? 0;

		return message.channel.send(
			client.embed(
				{
					title: `${target.username}'s balance`,
					fields: [
						{
							name: "Wallet",
							value: wallet,
							inline: true,
						},
						{
							name: "Bank",
							value: bank,
							inline: true,
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
