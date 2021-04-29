const ms = require("ms");
module.exports = {
	name: "daily",
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
					Inventory: [],
				}
			);

		const cooldown = UserEconomy?.DailyCooldown ?? now;

		if (cooldown > now) {
			return message.channel.send(
				client.embed(
					{
						title: "Relax man!",
						description: `You can claim your daily again in **${ms(
							cooldown - now,
							{ long: true }
						)}**`,
					},
					message
				)
			);
		}

		const wallet = UserEconomy?.Wallet ?? 0;
		const multi = UserEconomy?.Multi ?? 1;
		const paycheck = 2500 * multi;

		await UserEconomySchema.update(
			{ User: message.author.id },
			{
				Wallet: wallet + paycheck,
				DailyCooldown: now + ms("1d"),
			}
		);

		message.channel.send(
			`Successfully added **${paycheck}** coins to your wallet!`
		);
	},
};
