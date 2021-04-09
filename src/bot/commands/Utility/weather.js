const weather = require("weather-js");
module.exports = {
	name: "weather",
	category: "utility",
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed({ title: "Please enter a city" }, message)
			);
		let city = args.join(" ");
		let degree = "C";

		await weather.find(
			{ search: city, degreeType: degree },
			function (err, result) {
				if (err || result === undefined || result.length === 0)
					return message.channel.send(
						client.embed(
							{ title: "Unknown city. Please try again." },
							message
						)
					);

                let current = result[0].current;
                let location = result[0].location;

				return message.channel.send(
					client
						.embed(
							{
								description: `> ${current.skytext}`,
								author: {name: current.observationpoint},
                                thumbnail: {url: current.imageUrl},
                                fields: [
                                    {
                                        name: "Latitude", 
                                        value: location.lat, 
                                        inline: true
                                    },
                                    {
                                        name: "Longitude",
                                        value: location.long,
                                        inline: true
                                    },
                                    {
                                        name: "Feels Like",
                                        value: `${current.feelslike}° Degrees`,
                                        inline: true
                                    },
                                    {
                                        name: "Degree Type", 
                                        value: location.degreetype,
                                        inline: true
                                    },
                                    {
                                        name: "Winds", 
                                        value: current.winddisplay,
                                        inline: true
                                    },
                                    {
                                        name: "Humidity",
                                        value: `${current.humidity}%`, 
                                        inline: true
                                    },
                                    {
                                        name: "Timezone",
                                        value: `GMT ${location.timezone}`, 
                                        inline: true
                                    },
                                    {
                                        name: "Temperature",
                                        value: `${current.temperature}° Degrees`,
                                        inline: true
                                    },
                                    {
                                        name: "Observation Time",
                                        value: current.observationtime,
                                        inline: true
                                    }
                                ]
							},
							message
						)
				);
			}
		);
	},
};
