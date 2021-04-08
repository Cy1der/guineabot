// @ts-nocheck
const consola = require("consola");
module.exports = {
	name: "shardCreate",
	run: (shard) => {
		const { id } = shard;
		consola.success(`[BOT] > Shard ${id} created`);
	},
};
