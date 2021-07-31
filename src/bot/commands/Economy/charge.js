module.exports = {
	name: "charge",
	category: "economy",
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{ title: "Choose either phone or laptop!" },
					message
				)
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

		const options = ["phone", "laptop"];

		const validateOption = options.indexOf(args[0].toLowerCase());
		if (validateOption === -1)
			return message.channel.send(
				client.embed(
					{
						title: "Invalid option!",
						description:
							"You must choose either **phone** or **laptop**",
					},
					message
				)
			);

		if (validateOption === 0) {
			const checkForPhone = UserEconomy?.Inventory.findIndex((item) => {
				return item.id === "phone";
			});
			const checkforPhoneCharger = UserEconomy?.Inventory.findIndex(
				(item) => {
					return item.id === "charger-phone";
				}
			);

			if (checkForPhone === -1)
				return message.channel.send(
					client.embed(
						{
							title: "You lack an item!",
							description: "You need a **smartphone** to charge!",
						},
						message
					)
				);
			if (checkforPhoneCharger === -1)
				return message.channel.send(
					client.embed(
						{
							title: "You lack an item!",
							description:
								"You need a **smartphone charger** to charge your phone with!",
						},
						message
					)
				);

			let invCopy = UserEconomy?.Inventory;

			invCopy[checkForPhone].charge = 100;

			await UserEconomySchema.update(
				{ User: message.author.id },
				{
					Inventory: invCopy,
				}
			);

			return message.channel.send(
				`Your smartphone now has **100** charge`
			);
		} else if (validateOption === 1) {
			const checkForLaptop = UserEconomy?.Inventory.findIndex((item) => {
				return item.id === "laptop";
			});
			const checkforLaptopCharger = UserEconomy?.Inventory.findIndex(
				(item) => {
					return item.id === "charger-laptop";
				}
			);

			if (checkForLaptop === -1)
				return message.channel.send(
					client.embed(
						{
							title: "You lack an item!",
							description: "You need a **laptop** to charge!",
						},
						message
					)
				);
			if (checkforLaptopCharger === -1)
				return message.channel.send(
					client.embed(
						{
							title: "You lack an item!",
							description:
								"You need a **laptop charger** to charge your phone with!",
						},
						message
					)
				);

			let invCopy = UserEconomy?.Inventory;

			invCopy[checkForLaptop].charge = 100;

			await UserEconomySchema.update(
				{ User: message.author.id },
				{
					Inventory: invCopy,
				}
			);

			return message.channel.send(`Your laptop now has **100** charge`);
		}
	},
};
