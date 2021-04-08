module.exports = {
	schemas: [
		{
			name: "guildconfig",
			data: {
				Guild: String,
				Prefix: String,
				Leveling: Boolean,
			},
		},
		{
			name: "userData",
			data: {
				User: String,
				Blacklisted: Boolean,
			},
		},
	],
};
