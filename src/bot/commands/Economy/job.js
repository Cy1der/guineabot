const ms = require("ms");
module.exports = {
	name: "job",
	category: "economy",
	run: async (client, message, args, prefix) => {
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

		const cooldown = UserEconomy?.JobCooldown ?? now;
		const job = UserEconomy?.Job ?? "Unemployed";

		const options = ["list", "resign", "apply"];
		if (!args.length || options.indexOf(args[0].toLowerCase()) === -1)
			return message.channel.send(
				client.embed(
					{
						fields: [
							{
								name: "Available Options",
								value: `\`\`\`${options.join(", ")}\`\`\``,
							},
						],
					},
					message
				)
			);

		if (args[0].toLowerCase() === "list")
			return message.channel.send(
				client.embed(
					{
						title: "Available Jobs",
						description: `Do \`${prefix}job apply <job name>\` to get a job!\n\n${client.economy.jobs
							.map((j) => `**${j.name}**\n${j.description}\n`)
							.join("\n")}`,
					},
					message
				)
			);

		if (args[0].toLowerCase() === "resign") {
			if (cooldown > now) {
				return message.channel.send(
					client.embed(
						{
							title: "Relax man!",
							description: `You can update your job again in **${ms(
								cooldown - now,
								{ long: true }
							)}**`,
						},
						message
					)
				);
			}

			if (job === "Unemployed")
				return message.channel.send(
					client.embed(
						{
							title: "You are already unemployed!",
						},
						message
					)
				);

			await UserEconomySchema.update(
				{ User: message.author.id },
				{
					Job: "Unemployed",
					JobCooldown: now + ms("3d"),
				}
			);

			return message.channel.send(
				client.embed({ title: "You are now unemployed!" }, message)
			);
		}

		if (args[0].toLowerCase() === "apply") {
			if (cooldown > now) {
				return message.channel.send(
					client.embed(
						{
							title: "Relax man!",
							description: `You can update your job again in **${ms(
								cooldown - now,
								{ long: true }
							)}**`,
						},
						message
					)
				);
			}

			if (job !== "Unemployed")
				return message.channel.send(
					client.embed(
						{
							title: "You already have a job!",
						},
						message
					)
				);

			if (!args[1])
				return message.channel.send(
					client.embed(
						{ title: "Please provide the new job!" },
						message
					)
				);

			const newjob = args.slice(1).join(" ");
			const newjob_valid = client.economy.jobs
				.map((j) => j.name.toLowerCase())
				.indexOf(newjob.toLowerCase());

			if (newjob_valid === -1)
				return message.channel.send(
					client.embed({ title: "Invalid Job!" }, message)
				);

			await UserEconomySchema.update(
				{ User: message.author.id },
				{
					Job: client.economy.jobs[newjob_valid].name,
					Multi: client.economy.jobs[newjob_valid].multi,
					JobCooldown: now + ms("3d"),
				}
			);

			return message.channel.send(
				client.embed(
					{
						title: `You are now a ${client.economy.jobs[newjob_valid].name}!`,
						description:
							client.economy.jobs[newjob_valid].description,
					},
					message
				)
			);
		}
	},
};
