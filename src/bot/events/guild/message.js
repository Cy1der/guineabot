// @ts-nocheck
const ms = require("ms");
const leven = require("leven");
module.exports = {
	name: "message",
	run: async (client, message) => {
		if (message.author.bot || !message.guild) return;
		const GuildConfigSchema = await client.db.load("guildconfig");
		const GuildConfig = await GuildConfigSchema.findOne({
			Guild: message.guild.id,
		});
		const UserDataSchema = await client.db.load("userData");
		const UserData = await UserDataSchema.findOne({
			User: message.author.id,
		});
		let prefix = GuildConfig?.Prefix ?? "g?";
		let blacklisted = UserData?.Blacklisted ?? false;
		let leveling = GuildConfig?.Leveling ?? true;
		if (
			!blacklisted &&
			leveling &&
			!client.recent.has(`${message.author.id}-${message.guild.id}`)
		) {
			const earnedXP = Math.floor(Math.random() * 10) + 1;
			const levelUp = await client.leveling.appendXp(
				message.author.id,
				message.guild.id,
				earnedXP
			);
			if (levelUp) {
				const user = await client.leveling.fetch(
					message.author.id,
					message.guild.id
				);
				message.channel.send(
					client.embed(
						{
							title: "🎉 | Level Up!",
							description: `Congratulations ${message.author}!\nYou leveled up to level **${user.level}**!`,
						},
						message
					)
				);
			}

			client.recent.add(`${message.author.id}-${message.guild.id}`);
			setTimeout(() => {
				client.recent.delete(
					`${message.author.id}-${message.guild.id}`
				);
			}, ms("45s"));
		}
		if (
			message.content.startsWith(`<@!${client.user.id}>`) ||
			message.content.startsWith(`<@${client.user.id}>`)
		)
			return message.channel.send(
				client.embed(
					{
						fields: [
							{
								name: "Current Prefix",
								value: `\`\`\`${prefix}\`\`\``,
							},
						],
					},
					message
				)
			);
		if (!message.content.toLowerCase().startsWith(prefix.toLowerCase()))
			return;
		if (blacklisted === true && !client.owners.includes(message.author.id))
			return message.channel.send(
				client.embed(
					{
						title:
							"You have been prevented access from running Guineabot commands",
					},
					message
				)
			);
		const [cmd, ...args] = message.content
			.trim()
			.slice(prefix.length)
			.split(/ +/g);
		const command =
			client.commands.get(cmd.toLowerCase()) ||
			client.commands.get(client.aliases.get(cmd.toLowerCase()));
		if (!command) {
			const best = [
				...client.commands.map((cmd) => cmd.name),
				...client.aliases.keys(),
			].filter(
				(c) =>
					leven(cmd.toLowerCase(), c.toLowerCase()) < c.length * 0.4
			);
			const dym =
				best.length == 0
					? ""
					: best.length == 1
					? `Did you mean \`${best[0]}\`?`
					: `Did you mean one of these?\n${best
							.map((value) => `\`${value}\``)
							.join(", ")}`;
			return message.channel.send(
				client.embed(
					{ title: `Command not found`, description: dym },
					message
				)
			);
		}
		if (client.cooldowns.has(`${message.author.id}-${command.name}`))
			return message.channel.send(
				client.embed(
					{
						title: `You are on cooldown for ${ms(
							client.cooldowns.get(
								`${message.author.id}-${command.name}`
							) - Date.now(),
							{ long: true }
						)}!`,
					},
					message
				)
			);
		if (command.ownerOnly == true) {
			if (!client.owners.includes(message.author.id))
				return message.channel.send(
					client.embed(
						{
							title: "You are not allowed to run this command.",
						},
						message
					)
				);
		}
		if (!message.member.permissions.has(command.userPermissions))
			return message.channel.send(
				client.embed(
					{
						title:
							"You do not have the required permissions to run this command!",
						fields: [
							{
								name: "Required Permissions",
								value: command.userPermissions
									.map(
										(permission) =>
											`${
												permission[0].toUpperCase() +
												permission
													.slice(1)
													.toLowerCase()
													.replace(/_/gi, " ")
											}`
									)
									.join(", "),
							},
						],
					},
					message
				)
			);
		if (!message.guild.me.permissions.has(command.botPermissions))
			return message.channel.send(
				client.embed(
					{
						title:
							"I do not have the required permissions to run this command!",
						fields: [
							{
								name: "Required Permissions",
								value: command.botPermissions
									.map(
										(permission) =>
											`${
												permission[0].toUpperCase() +
												permission
													.slice(1)
													.toLowerCase()
													.replace(/_/gi, " ")
											}`
									)
									.join(", "),
							},
						],
					},
					message
				)
			);

		try {
			await command.run(client, message, args, prefix);
			if (command.cooldown) {
				client.cooldowns.set(
					`${message.author.id}-${command.name}`,
					Date.now() + command.cooldown
				);
				setTimeout(() => {
					client.cooldowns.delete(
						`${message.author.id}-${command.name}`
					);
				}, command.cooldown);
			}
		} catch (e) {
			client.logger.error(e);
			return message.channel.send(
				client.embed(
					{
						title: "An error occurred!",
						description:
							"Please report this error to the developer!",
						fields: [
							{ name: "Message", value: `\`${e.message}\`` },
						],
					},
					message
				)
			);
		}
	},
};
