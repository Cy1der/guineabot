const ms = require("ms");
module.exports = {
	name: "lottery",
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

		const cooldown = UserEconomy?.LotteryCooldown ?? now;

		if (cooldown > now) {
			return message.channel.send(
				client.embed(
					{
						title: "Relax!",
						description: `You can test your luck again in **${ms(
							cooldown - now,
							{ long: true }
						)}**`,
					},
					message
				)
			);
		}

		const wallet = UserEconomy?.Wallet ?? 0;

		if (wallet < 15000)
			return message.channel.send(
				`You need at least **15000** coins in your wallet!`
			);

		const chance = Math.floor(Math.random() * 2500) + 1;
		const chance_find = Math.floor(Math.random() * 2500) + 1;

		await message.channel.send(
			`**Are you sure you want to test your luck? This will cost __15000__ coins!**\nType \`y\` or \`n\` within the next 30 seconds to proceed.`
		);

		const filter = (m) =>
			(m.author.id === message.author.id &&
				m.content.toLowerCase().includes("y")) ||
			m.content.toLowerCase().includes("n");
		let collector;

		try {
			collector = await message.channel.awaitMessages(filter, {
				max: 1,
				time: ms("30s"),
				errors: ["time"],
			});
		} catch (e) {
			return message.channel.send("You did not respond with `n` or `y`!");
		}

		const first = collector.first().content;

		if (first.toLowerCase() === "n") {
			return message.channel.send("Alright, cancelled.");
		}

		if (first.toLowerCase() === "y") {
			if (chance === chance_find) {
				await UserEconomySchema.update(
					{ User: message.author.id },
					{
						Wallet: wallet + 500000,
						LotteryCooldown: now + ms("5d"),
					}
				);

				return message.channel.send(
					"Congratulations! You won the lottery! **500000** coins have been added to your wallet."
				);
			} else {
				await UserEconomySchema.update(
					{ User: message.author.id },
					{
						Wallet: wallet - 15000,
						LotteryCooldown: now + ms("5d"),
					}
				);

				return message.channel.send("Well that sucks, you lost!");
			}
		}
	},
};
