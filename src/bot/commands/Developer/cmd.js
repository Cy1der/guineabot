const process = require("child_process");
module.exports = {
	name: "cmd",
	category: "developer",
	ownerOnly: true,
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{ title: "Please enter a terminal command to run!" },
					message
				)
			);
		process.exec(args.slice(0).join(" "), (error, stdout) => {
			let response = error || stdout;
			message.channel.send(
				client.embed(
					{
						description: `\`\`\`${
							response.length > 2042
								? response.substr(0, 2039) + "..."
								: response
						}\`\`\``,
					},
					message
				)
			);
		});
	},
};
