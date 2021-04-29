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
		{
			name: "userEconomy",
			data: {
				User: String,
				Wallet: Number,
				Bank: Number,
				Multi: Number,
				Job: String,
				JobCooldown: Date,
				DailyCooldown: Date,
				WeeklyCooldown: Date,
				WorkCooldown: Date,
				RobCooldown: Date,
				BankrobCooldown: Date,
				LotteryCooldown: Date,
				Inventory: Array,
			},
		},
	],
};
