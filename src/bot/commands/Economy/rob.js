const ms = require("ms");
module.exports = {
	name: "rob",
	aliases: ["steal"],
	category: "economy",
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{ title: "You need to mention someone to rob!" },
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
		const UserEconomyVictim = await UserEconomySchema.findOne({
			User: target.id,
		});
		const UserEconomyRobber = await UserEconomySchema.findOne({
			User: message.author.id,
		});
		const now = Date.now();

		if (!UserEconomyVictim)
			UserEconomyVictim = await UserEconomySchema.update(
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
				}
			);

		if (!UserEconomyRobber)
			UserEconomyRobber = await UserEconomySchema.update(
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

		const RobberCooldown = UserEconomyRobber?.RobCooldown ?? now;
		const VictimWallet = UserEconomyVictim?.Wallet ?? 0;
		const RobberWallet = UserEconomyRobber?.Wallet ?? 0;

		if (RobberCooldown > now)
			return message.channel.send(
				client.embed(
					{
						title: "Relax!",
						description: `You can rob again in **${ms(
							RobberCooldown - now,
							{ long: true }
						)}**`,
					},
					message
				)
			);

		if (target.id === message.author.id)
			return message.channel.send(
				client.embed(
					{
						title: "You cannot rob yourself!",
					},
					message
				)
			);

		if (RobberWallet < 2500)
			return message.channel.send(
				client.embed(
					{
						title:
							"You must have at least 2500 coins in your wallet!",
					},
					message
				)
			);
		if (VictimWallet < 1250)
			return message.channel.send(
				client.embed(
					{
						title:
							"It's not worth it, the victim does not have 1250 coins in their wallet.",
					},
					message
				)
			);

		const amount = parseInt(Math.floor(Math.random() * (VictimWallet / 2)));

		await UserEconomySchema.update(
			{ User: message.author.id },
			{
				Wallet: RobberWallet + amount,
				RobCooldown: now + ms("3h"),
			}
		);

		await UserEconomySchema.update(
			{ User: target.id },
			{
				Wallet: VictimWallet - amount,
			}
		);

		target.send(
			`**${message.author.username}** stole **${amount}** coins from you!`
		);

		return message.channel.send(
			`You stole **${amount}** coins from ${target.username}!`
		);
	},
};
