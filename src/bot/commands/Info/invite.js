const { Permissions } = require("discord.js");
module.exports = {
	name: "invite",
	category: "information",
	run: async (client, message) => {
		const Invite = await client.generateInvite({
			permissions: Permissions.ALL,
		});
		const Server = client.server;

		return message.channel.send(
			client.embed(
				{
					title: "Guineabot Links",
					fields: [
						{
							name: "Bot Invite",
							value: `[discord.com](${Invite})`,
						},
						{
							name: "Server Invite",
							value: `[discord.gg](${Server})`,
						},
						{
							name: "Website",
							value: `Coming soon!`,
						},
					],
				},
				message
			)
		);
	},
};
