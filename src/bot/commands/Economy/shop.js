module.exports = {
	name: "shop",
	category: "economy",
	run: async (client, message) => {
		const techItems = client.economy.shop.filter((item) => {
			return item.category === "Tech";
		});
		const petItems = client.economy.shop.filter((item) => {
			return item.category === "Pets";
		});
		const foodItems = client.economy.shop.filter((item) => {
			return item.category === "Food";
		});

		return message.channel.send(
			client.embed(
				{
					title: "Item shop",
					description: "Item | ID | Price\n\n*More items coming in the future!*",
					fields: [
						{
							name: "Tech",
							value: techItems
								.map((item) => {
									return `${item.name} | ${item.id} | ${item.price}`;
								})
								.sort((a, b) => {
									return a.length - b.length;
								}),
						},
						{
							name: "Pets",
							value: petItems
								.map((item) => {
									return `${item.name} | ${item.id} | ${item.price}`;
								})
								.sort((a, b) => {
									return a.length - b.length;
								}),
						},
						{
							name: "Food",
							value: foodItems
								.map((item) => {
									return `${item.name} | ${item.id} | ${item.price}`;
								})
								.sort((a, b) => {
									return a.length - b.length;
								}),
						},
					],
				},
				message
			)
		);
	},
};
