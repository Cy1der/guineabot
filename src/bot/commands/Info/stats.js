const os = require("os");
const cpuStat = require("cpu-stat");
const prettyMs = require("pretty-ms");
module.exports = {
	name: "stats",
	category: "information",
	run: async (client, message) => {
		let avgClockMHz = cpuStat.avgClockMHz();
		let cpuName = os.cpus()[0].model;
		let cpuCores = os.cpus().length;
		module.exports = {
			name: "ping",
			category: "information",
			aliases: ["pong"],
			run: async (client, message) => {
				const msg = await message.channel.send(
					client.embed(
						{
							description: "📶 Pinging...",
							title: "Discord Gateway Ping in Progress",
						},
						message
					)
				);

				await msg.edit(
					client.embed(
						{
							description: `Websocket: ${
								client.ws.ping
							} ms\nMessage Edit: ${
								msg.createdTimestamp - message.createdTimestamp
							} ms`,
							title: "Discord Gateway Ping Complete",
						},
						message
					)
				);
			},
		};

		let osType = os.type();
		let osVersion = os.version();
		let osArch = os.arch();
		let osPlatform = os.platform();
		let osBuild = os.release();

		let clientUptime = prettyMs(message.client.uptime, {
			verbose: true,
			separateMilliseconds: true,
			formatSubMilliseconds: true,
			secondsDecimalDigits: 0,
		});

		let nodeVersion = process.version;

		let memUsage = formatBytes(process.memoryUsage().heapUsed);
		let memTotal = formatBytes(os.totalmem());

		let cpuStr = `__Model:__ ${cpuName}\n__Core Count:__ ${cpuCores}\n__Clock Speed:__ ${formatHertz(
			avgClockMHz
		)}\n`;
		let osStr = `__Version:__ ${osVersion}\n__Platform:__ ${osPlatform}\n__Build:__ ${osBuild}\n__Type:__ ${osType}\n__Architecture:__ ${osArch}`;
		let memoryStr = `__Total Memory:__ ${memTotal}\n__Memory Usage:__ ${memUsage}`;

		cpuStat.usagePercent(async (err, percent) => {
			if (err) {
				client.logger.error(err);
				return await message.channel.send(
					client.embed(
						{
							title: "An error occurred!",
							description:
								"Please report this error to the developer!",
							fields: [
								{
									name: "Message",
									value: `\`${err.message}\``,
								},
							],
						},
						message
					)
				);
			}

			cpuStr += `__Usage:__ ${percent.toFixed(2)} %`;
			return await message.channel.send(
				client
					.embed({ title: "Guineabot Statistics" }, message)
					.addField("CPU Stats", cpuStr)
					.addField("Operating System", osStr)
					.addField("Memory Stats", memoryStr)
					.addField(
						"Client Stats",
						`__Uptime:__ ${clientUptime}\n__Node Version:__ ${nodeVersion}`
					)
			);
		});
	},
};

function formatBytes(a, b) {
	if (0 == a) return "0 Bytes";
	let c = 1024;
	let d = b || 2;
	let e = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
	let f = Math.floor(Math.log(a) / Math.log(c));

	return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
}

function formatHertz(mhz) {
	if (mhz > 1000) {
		const ghz = mhz / 1000;
		return `${ghz.toFixed(1)} GHz`;
	} else return `${mhz} MHz`;
}
