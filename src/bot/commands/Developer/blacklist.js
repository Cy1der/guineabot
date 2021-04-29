const bin = require("sourcebin_js");
module.exports = {
	name: "blacklist",
	category: "developer",
	ownerOnly: true,
	run: async (client, message, args) => {
		const UserDataSchema = await client.db.load("userData");
		const BlackListData = await UserDataSchema.leaderboard(() => 1);
		const Blacklist =
			BlackListData.filter((data) => data.Blacklisted == true).length > 0
				? BlackListData.filter((data) => data.Blacklisted == true)
						.map((userData) => {
							const user = client.users.cache.find(
								(user) => user.id === userData.User
							);
							return `${user.tag} (${user.id})`;
						})
						.join("\n")
				: "empty...";
		const BlacklistURL = await bin
			.create(
				[
					{
						name: "Guineabot/Cy1der",
						content: Blacklist,
						languageId: "Text",
					},
				],
				{
					title: "Guineabot Blacklist",
					description:
						"All users who are not allowed to run Guineabot commands",
				}
			)
			.then((bin) => {
				return bin.url;
			});

		if (!args.length)
			return message.channel.send(
				client.embed(
					{
						title: "Complete Guineabot Blacklist",
						url: BlacklistURL,
					},
					message
				)
			);

		const target =
			message.mentions.users.first() ||
			client.users.cache.find((user) => user.id === args[0]);

		if (!target) return message.channel.send(
			client.embed(
				{
					title:
						"Invalid user",
				},
				message
			)
		);

		const UserData = await UserDataSchema.findOne({
			User: target.id,
		});
		let blacklisted = UserData?.Blacklisted ?? false;
		if (blacklisted === true)
			return message.channel.send(
				client.embed({ title: "User is already blacklisted" }, message)
			);
		await UserDataSchema.update(
			{
				User: target.id,
			},
			{
				Blacklisted: true,
			}
		);
		return message.channel.send(
			client.embed(
				{
					title: `Successfully blacklisted ${
						client.users.cache.find((user) => user.id === target.id)
							.tag
					}`,
				},
				message
			)
		);
	},
};
