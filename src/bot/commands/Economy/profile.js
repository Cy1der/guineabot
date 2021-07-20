module.exports = {
	name: "profile",
	category: "economy",
	run: async (client, message, args) => {
		const target =
			message.mentions.users.first() ||
			client.users.cache.get(args[0]) ||
			message.author;

		const UserEconomySchema = await client.db.load("userEconomy");
		const UserEconomy = await UserEconomySchema.findOne({
			User: target.id,
		});

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
		const multi = [
			UserEconomy?.Multi * 100 - 100,
			UserEconomy?.Multi * 100,
		];
		const job = UserEconomy?.Job ?? "Unemployed";
		const inventory = UserEconomy?.Inventory.length ?? 0;

		return message.channel.send(
			client.embed(
				{
					title: `${target.username}'s profile`,
					fields: [
						{
							name: "Balance",
							value: `Wallet: ${wallet}\nBank: ${bank}`,
						},
						{
							name: "Coin Multiplier",
							value: `${multi[1]}% (${
								multi[0] > 1
									? `+${multi[0]}`
									: multi[0] > 0 && multi[0] < 1
									? `-${multi[0]}`
									: multi[0]
							}%)`,
						},
						{
							name: "Job",
							value: job,
						},
						{
							name: "Inventory",
							value: `${inventory} items`,
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
