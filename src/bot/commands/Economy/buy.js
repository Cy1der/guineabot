module.exports = {
	name: "buy",
	category: "economy",
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed({ title: "You must provide an item ID!" }, message)
			);

		const UserEconomySchema = await client.db.load("userEconomy");
		let UserEconomy = await UserEconomySchema.findOne({
			User: message.author.id,
		});
		const now = Date.now();

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

		const wallet = UserEconomy?.Wallet ?? 0;

		const validateItem = client.economy.shop.findIndex((item) => {
			return item.id === args[0].toLowerCase();
		});

		if (validateItem === -1)
			return message.channel.send(
				client.embed(
					{
						title: "Invalid item ID!",
						description:
							"Check the shop for a list of valid item IDs",
					},
					message
				)
			);

		const item = client.economy.shop[validateItem];
		const invCopy = UserEconomy?.Inventory;

		if (wallet < item.price)
			return message.channel.send(
				client.embed({
					title: "You don't have enough coins!",
					description: `You need **${
						item.price - wallet
					}** more coins!`,
				})
			);

		invCopy.push(item);

		await UserEconomySchema.update(
			{ User: message.author.id },
			{
				Wallet: wallet - item.price,
				Inventory: invCopy,
			}
		);

		message.channel.send(
			client.embed(
				{
					title: "Success!",
					description: `Successfully purchased 1 **${item.name}** for **${item.price}** coins`,
				},
				message
			)
		);
	},
};
