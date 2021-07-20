const ms = require("ms");
module.exports = {
	name: "postmeme",
	aliases: ["pm"],
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
				}
			);

		const cooldown = UserEconomy?.PMCooldown ?? now;

		if (cooldown > now) {
			return message.channel.send(
				client.embed(
					{
						title: "Relax!",
						description: `You can post memes again in **${ms(
							cooldown - now,
							{ long: true }
						)}**`,
					},
					message
				)
			);
		}

		const checkForLaptop = UserEconomy?.Inventory.findIndex((item) => {
			return item.id === "laptop";
		});
		const checkForMouse = UserEconomy?.Inventory.findIndex((item) => {
			return item.id === "mouse";
		});

		if (checkForLaptop === -1)
			return message.channel.send(
				client.embed(
					{
						title: "You lack an item!",
						description: `You need a **laptop** to post memes`,
					},
					message
				)
			);

		const laptop = UserEconomy?.Inventory[checkForLaptop];

		if (laptop.charge <= 10)
			return message.channel.send(
				client.embed(
					{
						title: "Your laptop lacks enough charge!",
						description: `Purchase or use your existing laptop charger to charge your laptop`,
					},
					message
				)
			);

		let invCopy = UserEconomy?.Inventory;

		const multi = UserEconomy?.Multi ?? 1;
		const effort = Math.floor(Math.random() * 10) + 1;
		const earnings = Number(
			(
				((Math.floor(Math.random() * (750 - 250) + 250) + 1) /
					client.economy.tax) *
					(checkForMouse !== -1
						? invCopy[checkForMouse].booster
						: 1) +
				effort * (multi * 2)
			).toFixed(2)
		);

		invCopy[checkForLaptop].charge -= 15;

		await UserEconomySchema.update(
			{ User: message.author.id },
			{
				Wallet: UserEconomy?.Wallet + earnings,
				PMCooldown: now + ms("3h"),
				Inventory: invCopy,
			}
		);

		let effortMsg = "";

		if (effort <= 3) effortMsg = "almost no effort on";
		else if (effort <= 7 && effort >= 4)
			effortMsg = "a decent amount of effort on";
		else if (effort >= 8 && effort <= 10) effortMsg = "lots of effort on";

		message.channel.send(
			`You posted a meme you put ${effortMsg} and earned **${earnings}** coins.\nYour laptop has **${
				invCopy[checkForLaptop].charge
			}** charge left.\n${
				checkForMouse !== -1
					? "Your mouse granted you an extra 15% boost in coins!"
					: ""
			}`
		);
	},
};
