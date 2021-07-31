module.exports = {
	name: "deposit",
	aliases: ["dep"],
	category: "economy",
	run: async (client, message, args) => {
		const UserEconomySchema = await client.db.load("userEconomy");
		let UserEconomy = await UserEconomySchema.findOne({
			User: message.author.id,
		});

		if (!UserEconomy)
			UserEconomy = await UserEconomySchema.update(
				{ User: message.author.id },
				{
					User: message.author.id,
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
					PostCooldown: now,
				}
			);

		if (!args.length)
			return message.channel.send(
				client.embed(
					{
						title:
							"Please provide the amount of coins you want to deposit!",
					},
					message
				)
			);

		const amount = parseInt(args[0]);

		if (isNaN(amount))
			return message.channel.send(
				client.embed(
					{ title: "Please enter a numerical value!" },
					message
				)
			);

		const wallet = UserEconomy?.Wallet ?? 0;
		const bank = UserEconomy?.Bank ?? 0;

		if (amount > wallet)
			return message.channel.send(
				client.embed(
					{ title: `You are ${amount - wallet} coins short!` },
					message
				)
			);

		await UserEconomySchema.update(
			{ User: message.author.id },
			{
				Wallet: wallet - amount,
				Bank: bank + amount,
			}
		);

		return message.channel.send(
			`Successfully deposited **${amount}** coins into your bank!`
		);
	},
};
