// @ts-nocheck
const { Client, Intents, Collection, MessageEmbed } = require("discord.js");
const { promisify } = require("util");
const { Database } = require("zapmongo");
const steamapi = require("steamapi");
const consola = require("consola");
const glob = require("glob");
const ms = require("ms");
const config = require("../../config.json");
const { Manager, Structure } = require("erela.js");
const Spotify = require("erela.js-spotify");
const Deezer = require("erela.js-deezer");
const Facebook = require("erela.js-facebook"); //why the fuck did i install this package
const xp = require("discord-xp");
const { schemas } = require("./schemas");

const globPromise = promisify(glob);

Structure.extend(
	"Queue",
	(Queue) =>
		class extends Queue {
			switch(from, to) {
				if (typeof from !== "number")
					throw new TypeError("[BOT] from must be a number");
				if (typeof to !== "number")
					throw new TypeError("[BOT] to must be a number");
				if (
					from < 1 ||
					to < 1 ||
					from > this.length ||
					to > this.length
				)
					throw new Error(
						`[BOT] from/to must be between 1 and ${this.length}`
					);
				const fromPosition = this[from - 1];
				const toPosition = this[to - 1];
				this[from - 1] = toPosition;
				this[to - 1] = fromPosition;
			}
		}
);

Structure.extend(
	"Queue",
	(Queue) =>
		class extends Queue {
			move(from, to) {
				if (typeof from !== "number")
					throw new TypeError("[BOT] from must be a number");
				if (typeof to !== "number")
					throw new TypeError("[BOT] to must be a number");
				if (
					from < 1 ||
					to < 1 ||
					from > this.length ||
					to > this.length
				)
					throw new Error(
						`[BOT] from/to must be between 1 and ${this.length}`
					);
				const fromPosition = this[from - 1];
				const toPosition = this[to - 1];
				this[to - 1] = fromPosition;
				this.remove(from - 1);
				for (let i = to; i < this.length; i++) {
					i === to
						? (this[i - 1] = toPosition)
						: (this[i - 1] = this[i]);
				}
				this[to] = toPosition;

				//this is very inefficient (i think), if you have a better way please tell me
			}
		}
);

xp.setURL(config.bot.mongoURI);

const client = new Client({
	ws: {
		intents: Intents.ALL,
	},
});

client.commands = new Collection();
client.events = new Collection();
client.musicEvents = new Collection();
client.shardEvents = new Collection();
client.cooldowns = new Collection();
client.aliases = new Collection();
client.categories = new Set();
client.recent = new Set();
client.leveling = xp;
client.config = config;
client.server = config.bot.server_invite;
client.owners = [...config.bot.owner_ids];
client.logger = consola;
client.db = new Database({
	mongoURI: config.bot.mongoURI,
	schemas: schemas,
});
client.embed = (options, message) => {
	return new MessageEmbed({ color: "RANDOM", ...options })
		.setFooter(
			`${message.author.tag}`,
			message.author.displayAvatarURL({
				dynamic: true,
				format: "png",
			})
		)
		.setTimestamp();
};
client.manager = new Manager({
	plugins: [
		new Spotify({
			clientID: config.bot.spotify_client_id,
			clientSecret: config.bot.spotify_client_secret,
		}),
		new Deezer(),
		new Facebook(),
	],
	clientName: "Guineabot",
	nodes: [
		{
			host: config.bot.lavalink.server,
			port: config.bot.lavalink.port,
			password: config.bot.lavalink.password,
			retryDelay: 1000,
			identifier: "node-1",
		},
		{
			host: config.bot.lavalink.server,
			port: config.bot.lavalink.port,
			password: config.bot.lavalink.password,
			retryDelay: 1000,
			identifier: "node-2",
		},
		{
			host: config.bot.lavalink.server,
			port: config.bot.lavalink.port,
			password: config.bot.lavalink.password,
			retryDelay: 1000,
			identifier: "node-3",
		},
	],
	send(id, payload) {
		const guild = client.guilds.cache.get(id);
		if (guild) guild.shard.send(payload);
	},
});
client.steam = new steamapi(config.bot.steam_token);

(async () => {
	const eventFiles = await globPromise(`${__dirname}/events/**/*.js`);
	const musicEventFiles = await globPromise(
		`${__dirname}/music_events/**/*.js`
	);
	const commandFiles = await globPromise(`${__dirname}/commands/**/*.js`);
	const shardFiles = await globPromise(
		`${__dirname}/shard_events/client/*.js`
	);

	consola.success(`[BOT] > ${commandFiles.length} commands loaded`);
	consola.success(`[BOT] > ${eventFiles.length} events loaded`);
	consola.success(`[BOT] > ${musicEventFiles.length} music events loaded`);
	consola.success(`[BOT] > ${shardFiles.length} shard events loaded`);

	eventFiles.map((event) => {
		const file = require(event);
		client.events.set(file.name, file);
		client.on(file.name, file.run.bind(null, client));
	});

	musicEventFiles.map((event) => {
		const file = require(event);
		client.musicEvents.set(file.name, file);
		client.manager.on(file.name, file.run.bind(null, client));
	});

	shardFiles.map((event) => {
		const file = require(event);
		client.shardEvents.set(file.name, file);
		client.manager.on(file.name, file.run.bind(null, client));
	});

	commandFiles.map((command) => {
		const file = require(command);
		client.commands.set(file.name, file);
		client.categories.add(file.category ?? "uncategorized");
		if (file.aliases)
			file.aliases.map((alias) => client.aliases.set(alias, file.name));
		if (!file.cooldown) file.cooldown = ms("1s");
		if (!file.ownerOnly) file.ownerOnly = false;
		if (!file.userPermissions) file.permissions = [];
		if (!file.botPermissions) file.botPermissions = [];
	});
})();

client.login(config.bot.token);

module.exports = client;
