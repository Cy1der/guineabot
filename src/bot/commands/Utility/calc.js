const math = require("mathjs");
module.exports = {
	name: "calc",
	category: "utility",
	run: async (client, message, args) => {
		if (!args.length)
			return message.channel.send(
				client.embed(
					{
						title: "Please enter a math equation",
					},
					message
				)
			);

		try {
			let input = args.join(" ").replace(/pie/gi, "pi");
			let array = input.split(/ +/g);
			input.split(/ +/g).map((value, index) => {
				if (
					value.toLowerCase() == "sq" &&
					!value.toLowerCase().startsWith("sq(")
				) {
					if (!array[index + 1]) throw { error: "No index" };
					try {
						math.evaluate(array[index + 1]);
						array[index] = `sqrt(${array[index + 1]})`;
						array[index + 1] = undefined;
						input = array
							.filter((val) => val != undefined)
							.join(" ");
					} catch (error) {
						console.log(error);
						throw { error: "Not a number" };
					}
				} else if (
					value.toLowerCase() == "tan" &&
					!value.toLowerCase().startsWith("tan(")
				) {
					if (!array[index + 1]) throw { error: "No index" };
					try {
						math.evaluate(array[index + 1]);
						array[index] = `tan(${array[index + 1]})`;
						array[index + 1] = undefined;
						input = array
							.filter((val) => val != undefined)
							.join(" ");
					} catch (error) {
						console.log(error);
						throw { error: "Not a number" };
					}
				} else if (
					value.toLowerCase() == "sin" &&
					!value.toLowerCase().startsWith("sin(")
				) {
					if (!array[index + 1]) throw { error: "No index" };
					try {
						math.evaluate(array[index + 1]);
						array[index] = `sin(${array[index + 1]})`;
						array[index + 1] = undefined;
						input = array
							.filter((val) => val != undefined)
							.join(" ");
					} catch (error) {
						console.log(error);
						throw { error: "Not a number" };
					}
				} else if (
					value.toLowerCase() == "cos" &&
					!value.toLowerCase().startsWith("cos(")
				) {
					if (!array[index + 1]) throw { error: "No index" };
					try {
						math.evaluate(array[index + 1]);
						array[index] = `cos(${array[index + 1]})`;
						array[index + 1] = undefined;
						input = array
							.filter((val) => val != undefined)
							.join(" ");
					} catch (error) {
						console.log(error);
						throw { error: "Not a number" };
					}
				}
			});
			let result = math.evaluate(input);
			return message.channel.send(
				client.embed(
					{
						fields: [
							{
								name: "Input",
								value: `\`\`\`${input}\`\`\``,
							},
							{
								name: "Output",
								value: `\`\`\`${result}\`\`\``,
							},
						],
					},
					message
				)
			);
		} catch (e) {
			console.log(e);
			return await message.channel.send(
				client.embed(
					{ title: "Sorry, I'm too dumb to solve this equation." },
					message
				)
			);
		}
	},
};
