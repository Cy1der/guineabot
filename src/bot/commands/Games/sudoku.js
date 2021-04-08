const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const sudoku = require("sudoku");
const path = require("path");
module.exports = {
	name: "sudoku",
	category: "games",
	run: async (client, message) => {
		let puzzle = sudoku.makepuzzle();
		for (let i = 0; i < puzzle.length; i++) {
			var index = puzzle.indexOf(null);
			if (index !== -1) {
				puzzle[index] = " ";
			}
		}

		// ---------canvas----------

		const applyText = (canvas, text) => {
			const ctx = canvas.getContext("2d");

			let fontSize = 70;

			do {
				ctx.font = `${(fontSize -= 1)}px Calibri`;
			} while (ctx.measureText(text).width > 53);

			return ctx.font;
		};

		let grayPositions = [];

		const image = path.join(
			process.cwd(),
			"/src/assets",
			"sudokuBoard.png"
		);

		const canvas = Canvas.createCanvas(555, 555);
		const ctx = canvas.getContext("2d");
		const background = await Canvas.loadImage(image);
		ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

		let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		for (let j = 0; j < imageData.data.length; j++) {
			if (imageData.data[j] === 204) {
				if (j % 4 === 0) {
					let x = (j / 4) % canvas.width;
					let y = Math.floor(j / 4 / canvas.width);

					grayPositions.push([x + 7, y - 4]);
				}
			}
		}

		for (let m = 0; m < grayPositions.length; m++) {
			ctx.font = applyText(canvas, puzzle[m]);
			ctx.fillStyle = "#000000";
			ctx.fillText(puzzle[m], grayPositions[m][0], grayPositions[m][1]);
		}

		const attachment = new MessageAttachment(
			canvas.toBuffer(),
			"sudokuBoard.jpg"
		);

		message.channel.send(
			client
				.embed({}, message)
				.attachFiles([
					{
						name: "sudokuBoard.png",
						attachment: attachment.attachment,
					},
				])
				.setImage("attachment://sudokuBoard.png")
		);
	},
};
