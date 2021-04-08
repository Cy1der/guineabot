// @ts-nocheck
const { ShardingManager } = require("discord.js");
const { promisify } = require("util");
const glob = require("glob");
const config = require("../../config.json");
const consola = require("consola");

const globPromise = promisify(glob);

function start() {
	const manager = new ShardingManager("./src/bot/index.js", {
		token: config.bot.token,
		respawn: true,
		totalShards: "auto",
		shardList: "auto",
	});

	(async () => {
		const shardEventFiles = await globPromise(
			`${__dirname}/shard_events/*.js`
		);

		consola.success(
			`[BOT] > Loaded ${shardEventFiles.length} sharding manager events`
		);

		shardEventFiles.map((event) => {
			const file = require(event);
			manager.on(file.name, file.run.bind(null));
		});
	})();

	manager.spawn();
}

module.exports = start;
