module.exports = {
	name: "inventory",
	aliases: ["inv"],
	category: "economy",
	run: async (client, message, args) => {
		const target =
			message.mentions.users.first() ||
			client.users.cache.get(args[0]) ||
			message.author;

		const UserEconomySchema = await client.db.load("userEconomy");
		let UserEconomy = await UserEconomySchema.findOne({
			User: target.id,
		});

		const now = Date.now();

		if (!UserEconomy)
			UserEconomy = await UserEconomySchema.update(
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

		const invCopy = UserEconomy?.Inventory;

		if (!invCopy.length)
			return message.channel.send(
				client.embed(
					{
						title: `${target.username}'s Inventory`,
						description: "It's empty in here...",
					},
					message
				)
			);

		let names = [];

		invCopy.forEach((item) => names.push(item.name));

		const counted = count(names);
		counted.sort((a, b) => {
			return a.length - b.length;
		});

		return message.channel.send(
			client.embed(
				{
					title: `${target.username}'s Inventory`,
					description: counted.join("\n"),
				},
				message
			)
		);
	},
};

function count(arr) {
	let final = [];
	arr.sort();

	let current = null;
	let cnt = 0;
	for (let i = 0; i < arr.length; i++) {
		if (arr[i] != current) {
			if (cnt > 0) {
				final.push(`${cnt}x ${current}`);
			}
			current = arr[i];
			cnt = 1;
		} else {
			cnt++;
		}
	}
	if (cnt > 0) {
		final.push(`${cnt}x ${current}`);
	}

	return final;
}
