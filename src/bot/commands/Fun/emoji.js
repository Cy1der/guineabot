const Jimp = require("jimp");
const { closest } = require("color-diff");
const twemoji = require("twemoji");
module.exports = {
	name: "emoji",
	category: "fun",
	run: async (client, message, args) => {
		if (!args.length)
			return await message.channel.send(
				client.wrongCommand(1, message, `${prefix}${name} <emoji>`)
			);
		const emojiRgb = [
			{
				R: 230,
				G: 231,
				B: 232,
				E: ":white_large_square:",
			}, // white
			{
				R: 91,
				G: 104,
				B: 118,
				E: ":new_moon:",
			}, // gray (not square)
			{
				R: 49,
				G: 55,
				B: 61,
				E: ":black_large_square:",
			}, // black
			{
				R: 221,
				G: 46,
				B: 68,
				E: ":red_square:",
			}, // red
			{
				R: 238,
				G: 122,
				B: 139,
				E: ":womens:",
			}, // pink
			{
				R: 255,
				G: 172,
				B: 51,
				E: ":orange_square:",
			}, // light orange
			{
				R: 253,
				G: 203,
				B: 88,
				E: ":yellow_square:",
			}, // yellow
			{
				R: 255,
				G: 217,
				B: 131,
				E: ":full_moon:",
			}, // yellowish (not square)
			{
				R: 120,
				G: 177,
				B: 89,
				E: ":green_square:",
			}, // green
			{
				R: 85,
				G: 172,
				B: 238,
				E: ":blue_square:",
			}, // light blue
			{
				R: 0,
				G: 0,
				B: 255,
				E: ":blue_square:",
			}, // blue (same as light blue)
			{
				R: 170,
				G: 142,
				B: 214,
				E: ":purple_square:",
			}, // purple
			{
				R: 168,
				G: 133,
				B: 214,
				E: ":star_of_david:",
			}, // darker purple
			{
				R: 193,
				G: 105,
				B: 79,
				E: ":brown_square:",
			}, // brown
		];

		const size = 16;

		const emoji = client.emojis.cache.find(
			(e) => e.name == args[0].split(":")[1]
		);

		let url = "";

		if (!emoji) {
			if (args[0].includes(".png") || args[0].includes(".jpg")) {
				url = args[0];
			} else {
				url = twemoji.parse(args[0]);
				if (!url.startsWith("<img"))
					return message.channel.send(
						client.embed(
							{
								title:
									"Only works with custom emojis from this server / default emojis / png or jpg urls of emojis.",
							},
							message
						)
					);
				url = url.substring(url.indexOf("src") + 5);
				url = url.substring(0, url.length - 3);
			}
		}

		if (emoji) {
			url = emoji.url;
			await message.channel.send(url);
		}

		Jimp.read(url, (err, img) => {
			if (err)
				return message.channel.send(
					client.embed({ title: "Could not read image" }, message)
				);
			img.resize(size, Jimp.AUTO, Jimp.RESIZE_BEZIER, (err, img) => {
				if (err)
					return message.channel.send(
						client.embed({ title: "Could not load image" }, message)
					);
				const transColors = [];
				for (let i = 0; i < img.getHeight(); i++) {
					for (let j = 0; j < img.getWidth(); j++) {
						const rgb = Jimp.intToRGBA(img.getPixelColor(j, i));
						const cdiff = closest(
							{
								R: rgb.r,
								G: rgb.g,
								B: rgb.b,
							},
							emojiRgb
						);
						const found = emojiRgb.find(
							(v) =>
								v.R == cdiff.R &&
								v.B == cdiff.B &&
								v.B == cdiff.B
						);
						transColors[i] = transColors[i] || [];
						transColors[i].push(
							found ? found.E : "black_large_square"
						);
					}
				}
				return message.channel.send(
					transColors.map((arr) => arr.join("")).join("\n") + ".",
					{
						split: true,
					}
				);
			});
		});
	},
};
