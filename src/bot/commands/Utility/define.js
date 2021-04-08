const ms = require("ms");
const axios = require("axios").default;
const bin = require("sourcebin_js");
module.exports = {
	name: "define",
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
				`https://dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${client.config.bot.dictionary_api_key}`
			)
			.then(async (data) => {
				let alldata = data.data;

				if (!alldata[0].meta) {
					message.channel.send(
						client.embed({ title: "Word not found" }, message)
					);
					return false;
				}

				let otherWords = [];

				for (let i = 0; i < alldata.length; i++) {
					otherWords.push(alldata[i].meta.id + ` (${alldata[i].fl})`);
				}

				let definitions = [];

				for (let j = 0; j < alldata[0].shortdef.length; j++) {
					definitions.push(`${j + 1}. ${alldata[0].shortdef[j]}`);
				}

				let synURL = await bin
					.create(
						[
							{
								name: "GuineaBot/Cy1der",
								content: `${
									alldata[0].meta.syns.length > 1
										? alldata[0].meta.syns
										: "none"
								}`,
								languageId: "JSON",
							},
						],
						{
							title: `Synonyms for ${alldata[0].meta.id}`,
							description: "Dictionary command executed",
						}
					)
					.then((bin) => {
						return bin.url;
					});

				let antURL = await bin
					.create(
						[
							{
								name: "GuineaBot/Cy1der",
								content: `${
									alldata[0].meta.ants.length > 1
										? alldata[0].meta.ants
										: "none"
								}`,
								languageId: "JSON",
							},
						],
						{
							title: `Synonyms for ${alldata[0].meta.id}`,
							description: "Dictionary command executed",
						}
					)
					.then((bin) => {
						return bin.url;
					});

				return await message.channel.send(
					client.embed(
						{
							title: `${alldata[0].meta.id} (${alldata[0].fl})`,
							description: `**Offensive?** ${
								alldata[0].meta.offensive ? "Yes" : "No"
							}`,
							fields: [
								{
									name: "Definition(s)",
									value: definitions.join("\n"),
								},
								{
									name: `Related to "${alldata[0].meta.id}"`,
									value: alldata[0].meta.stems.join(", "),
								},
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
									value: otherWords.join(", "),
								},
							],
						},
						message
					)
				);
			});
	},
};
