module.exports = {
	name: "give",
	category: "economy",
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{ title: "You need to mention someone to give money to!" },
					message
				)
			);
		if (!args[1])
			return message.channel.send(
				client.embed(
					{
						title:
							"You need to specify the amount of money to give!",
					},
					message
				)
			);

		const target =
			message.mentions.users.first() || client.users.cache.get(args[0]);

		if (!target)
			return message.channel.send(
				client.embed(
					{
						title: "Invalid user",
					},
					message
				)
			);

		const UserEconomySchema = await client.db.load("userEconomy");
		let UserEconomyReciever = await UserEconomySchema.findOne({
			User: target.id,
		});
		let UserEconomyHost = await UserEconomySchema.findOne({
			User: message.author.id,
		});

		const now = Date.now();

		if (!UserEconomyReciever)
			UserEconomyReciever = await UserEconomySchema.update(
				{ User: target.id },
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
					PostCooldown: now,
				}
			);

		if (!UserEconomyHost)
			UserEconomyHost = await UserEconomySchema.update(
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

		const RecieverWallet = UserEconomyReciever?.Wallet ?? 0;
		const HostWallet = UserEconomyHost?.Wallet ?? 0;

		if (target.id === message.author.id)
			return message.channel.send(
				client.embed(
					{
						title: "You cannot give money to yourself!",
					},
					message
				)
			);

		const amount = parseInt(args[1]);

		if (isNaN(amount))
			return message.channel.send(
				client.embed(
					{
						title:
							"Amount of money to give must be a numerical value",
					},
					message
				)
			);

		if (amount > HostWallet)
			return message.channel.send(
				client.embed(
					{ title: `You are ${amount - HostWallet} coins short!` },
					message
				)
			);

		await UserEconomySchema.update(
			{ User: message.author.id },
			{
				Wallet: HostWallet - amount,
			}
		);

		await UserEconomySchema.update(
			{ User: target.id },
			{
				Wallet: RecieverWallet + amount,
			}
		);

		target.send(
			`**${message.author.username}** gifted you **${amount}** coins!`
		);
		return message.channel.send(
			`You gave **${amount}** coins to ${target.username}!`
		);
	},
};
