const ms = require("ms");
module.exports = {
	name: "post",
	category: "economy",
	run: async (client, message) => {
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

		const cooldown = UserEconomy?.PostCooldown ?? now;

		if (cooldown > now) {
			return message.channel.send(
				client.embed(
					{
						title: "Relax!",
						description: `You can post pictures again in **${ms(
							cooldown - now,
							{ long: true }
						)}**`,
					},
					message
				)
			);
		}

		const checkForPhone = UserEconomy?.Inventory.findIndex((item) => {
			return item.id === "phone";
		});

		if (checkForPhone === -1)
			return message.channel.send(
				client.embed(
					{
						title: "You lack an item!",
						description: `You need a **smartphone** to post memes`,
					},
					message
				)
			);

		const phone = UserEconomy?.Inventory[checkForPhone];

		if (phone.charge <= 10)
			return message.channel.send(
				client.embed(
					{
						title: "Your phone lacks enough charge!",
						description: `Purchase or use your existing smartphone charger to charge your laptop`,
					},
					message
				)
			);

		let invCopy = UserEconomy?.Inventory;

		const multi = UserEconomy?.Multi ?? 1;
		const effort = Math.floor(Math.random() * 10) + 1;
		const earnings = Number(
			(
				(Math.floor(Math.random() * (750 - 250) + 250) + 1) /
					client.economy.tax +
				effort * (multi * 2)
			).toFixed(2)
		);

		invCopy[checkForPhone].charge -= 15;

		await UserEconomySchema.update(
			{ User: message.author.id },
			{
				Wallet: UserEconomy?.Wallet + earnings,
				PostCooldown: now + ms("3h"),
				Inventory: invCopy,
			}
		);

		message.channel.send(
			`You posted a picture on Instagram and earned **${earnings}** coins.\nYour smartphone has **${invCopy[checkForPhone].charge}** charge left.`
		);
	},
};
