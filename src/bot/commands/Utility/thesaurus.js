const ms = require("ms");
const axios = require("axios").default;
const bin = require("sourcebin_js");
module.exports = {
	name: "thesaurus",
	category: "utility",
	cooldown: ms("1m"),
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{
						title: "Please enter a word",
					},
					message
				)
			);

		let word = args.slice(0).join(" ");

		axios
			.get(
				`https://dictionaryapi.com/api/v3/references/ithesaurus/json/${word}?key=${client.config.bot.thesaurus_api_key}`
			)
			.then(async (data) => {
				let alldata = data.data;

				if (!alldata[0].meta)
					return await message.channel.send(
						client.embed({ description: "Word not found" }, message)
					);

				let otherWords = [];

				for (let i = 0; i < alldata.length; i++) {
					otherWords.push(alldata[i].meta.id + ` (${alldata[i].fl})`);
				}

				let syns = [];

				if (alldata[0].meta.syns.length > 0) {
					for (let i = 0; i < alldata[0].meta.syns.length; i++) {
						for (
							let j = 0;
							j < alldata[0].meta.syns[i].length;
							j++
						) {
							syns.push(alldata[0].meta.syns[i][j]);
						}
					}
				} else syns = ["none"];

				let synURL = await bin
					.create(
						[
							{
								name: "GuineaBot/Cy1der",
								content: `${syns.join("\n")}`,
								languageId: "Text",
							},
						],
						{
							title: `Synonyms for ${alldata[0].meta.id}`,
							description: "Thesaurus command executed",
						}
					)
					.then((bin) => {
						return bin.url;
					});

				let ants = [];

				if (alldata[0].meta.ants.length > 0) {
					for (let k = 0; k < alldata[0].meta.ants.length; k++) {
						for (
							let l = 0;
							l < alldata[0].meta.ants[k].length;
							l++
						) {
							ants.push(alldata[0].meta.ants[k][l]);
						}
					}
				} else ants = ["none"];

				let antURL = await bin
					.create(
						[
							{
								name: "GuineaBot/Cy1der",
								content: `${ants.join("\n")}`,
								languageId: "Text",
							},
						],
						{
							title: `Antonyms for ${alldata[0].meta.id}`,
							description: "Thesaurus command executed",
						}
					)
					.then((bin) => {
						return bin.url;
					});

				let others = await bin
					.create(
						[
							{
								name: "GuineaBot/Cy1der",
								content: `${
									otherWords.length
										? otherWords.join("\n")
										: "None"
								}`,
								languageId: "Text",
							},
						],
						{
							title: `Other results for ${alldata[0].meta.id}`,
							description: "Thesaurus command executed",
						}
					)
					.then((bin) => {
						return bin.url;
					});

				return await message.channel.send(
					client
						.embed(
							{ title: `Results for ${alldata[0].meta.id}` },
							message
						)
						.addFields(
							{
								name: "Synonyms",
								value: `[Here](${synURL})`,
							},
							{
								name: "Antonyms",
								value: `[Here](${antURL})`,
							},
							{
								name: `Other results`,
								value: `[Here](${others})`,
							}
						)
				);
			});
	},
};
