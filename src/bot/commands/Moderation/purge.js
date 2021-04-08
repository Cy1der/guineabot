const ms = require("ms");
module.exports = {
	name: "purge",
	userPermissions: ["MANAGE_MESSAGES"],
	botPermissions: ["MANAGE_MESSAGES"],
	category: "moderation",
	run: async (client, message, args) => {
		if (
			!args.length ||
			isNaN(args[0]) ||
			parseInt(args[0]) > 100 ||
			parseInt(args[0]) < 1
		)
			return message.channel.send(
				client.embed(
					{
						title:
							"Please enter a valid number of messages between 1 and 100!",
					},
					message
				)
			);
		const messages = await message.channel.messages.fetch({
			limit: parseInt(args[0]),
		});
		const usable = messages.filter(
			(m) => Date.now() - m.createdAt < ms("14d") && !m.pinned
		);
		await message.delete();
		await message.channel.bulkDelete(usable);
		const success = await message.channel.send(
			client.embed(
				{
					title: `Deleted ${usable.size} messages, pinned messages are ignored`,
				},
				message
			)
		);
		setTimeout(() => success.delete(), ms("5s"));
	},
};
