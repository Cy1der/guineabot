module.exports = {
	name: "eval",
	category: "developer",
	ownerOnly: true,
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{ title: "Please enter a code snippet to run!" },
					message
				)
			);

		if (args.join(" ").includes("client.token"))
			return await message.channel.send(
				client.embed(
					{
						description: `\`\`\`lmao nice try\`\`\``,
					},
					message
				)
			);

		let result = await eval(args.slice(0).join(" "));

		if (typeof result === "object")
			result = JSON.stringify(result, null, 4);

		if (!result)
			return await message.channel.send(
				client.embed(
					{
						description: `\`\`\`No content\`\`\``,
					},
					message
				)
			);

		return await message.channel.send(
			client.embed(
				{
					description: `\`\`\`js\n${
						result.length > 2039
							? result.substr(0, 2036) + "..."
							: result
					}\`\`\``,
				},
				message
			)
		);
	},
};
