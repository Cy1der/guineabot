const Trivia = require("trivia-api");
const { decode } = require("html-entities");
module.exports = {
	name: "trivia",
	category: "fun",
	run: async (client, message) => {
		const trivia = new Trivia({
			encoding: "base64",
		});
		trivia
			.getQuestions({
				type: "multiple",
			})
			.then(async (questions) => {
				let answers = questions.results[0].incorrect_answers;
				answers.push(questions.results[0].correct_answer);
				answers = shuffle(answers);

				return await message.channel.send(
					client
						.embed(
							{
								title: `${questions.results[0].category}`,
								description: `**Difficulty:** ${titleCase(
									questions.results[0].difficulty
								)}\n**Correct Answer:** ||${
									questions.results[0].correct_answer
								}||`,
							},
							message
						)
						.addField(
							`${decode(questions.results[0].question)}`,
							`A) ${answers[0]}\nB) ${answers[1]}\nC) ${answers[2]}\nD) ${answers[3]}`
						)
				);
			});
	},
};

function titleCase(str) {
	return str
		.toLowerCase()
		.split(/ +/g)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

function shuffle(array) {
	var currentIndex = array.length,
		temporaryValue,
		randomIndex;

	do {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	} while (0 !== currentIndex);

	return array;
}
