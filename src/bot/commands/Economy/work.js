const ms = require("ms");
module.exports = {
	name: "work",
	category: "economy",
	run: async (client, message, ...other) => {
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

		const cooldown = UserEconomy?.WorkCooldown ?? now;
		const job = UserEconomy?.Job ?? "Unemployed";

		if (job.toLowerCase() === "unemployed")
			return message.channel.send(
				client.embed(
					{
						title: "You can't work yet!",
						description: `You are currently unemployed, you need a job to work! Do \`${other[1]}job list\` for a list of jobs`,
					},
					message
				)
			);

		if (cooldown > now)
			return message.channel.send(
				client.embed(
					{
						title: "Relax man!",
						description: `You can work again in **${ms(
							cooldown - now,
							{ long: true }
						)}**`,
					},
					message
				)
			);

		const multi = UserEconomy?.Multi ?? 1;
		const hours = Math.floor(Math.random() * 10) + 1;
		const paycheck = (
			((Math.floor(Math.random() * (1500 - 750) + 750) + 1) /
				client.economy.tax) *
				multi +
			hours * (multi * 2)
		).toFixed(2);

		await UserEconomySchema.update(
			{ User: message.author.id },
			{
				Wallet: UserEconomy?.Wallet + paycheck,
				WorkCooldown: now + ms("12h"),
			}
		);

		return message.channel.send(
			`You worked **${hours}** hours as a **${job}** and earned **${paycheck}** coins!`
		);
	},
};
