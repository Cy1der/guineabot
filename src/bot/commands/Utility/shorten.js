const request = require("request");
const ms = require("ms");
module.exports = {
	name: "shorten",
	category: "utility",
	cooldown: ms("1m"),
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{
						title: "Please enter a URL",
					},
					message
				)
			);

		const URL = args.join(" ");

		if (isAbsoluteURL(URL) === false)
			return message.channel.send(
				client.embed({ title: "Please enter an absolute URL" }, message)
			);
		const options = {
			method: "POST",
			url: "https://url-shortener-service.p.rapidapi.com/shorten",
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				"x-rapidapi-key": client.config.bot.rapid_api_key,
				"x-rapidapi-host": "url-shortener-service.p.rapidapi.com",
				useQueryString: true,
			},
			form: {
				url: URL,
			},
		};

		request(options, (error, { body }) => {
			if (error)
				return message.channel.send(
					client.embed(
						{
							title: "An error occurred!",
							description:
								"Please report this error to the developer!",
							fields: [
								{
									name: "Message",
									value: `\`${error.message}\``,
								},
							],
						},
						message
					)
				);

			const result = JSON.parse(body);

			if (result.hasOwnProperty("error"))
				return message.channel.send(
					client.embed(
						{
							title: "An error occurred!",
							fields: [
								{
									name: "Message",
									value: `\`${result.error}\``,
								},
							],
						},
						message
					)
				);

			return message.channel.send(
				client.embed(
					{
						fields: [
							{
								name: "Input",
								value: `\`\`\`${URL}\`\`\``,
							},
							{
								name: "Output",
								value: `\`\`\`${result.result_url}\`\`\``,
							},
						],
					},
					message
				)
			);
		});
	},
};

function isAbsoluteURL(url) {
	if (/^[a-zA-Z]:\\/.test(url)) {
		return false;
	}
	return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(url);
}
