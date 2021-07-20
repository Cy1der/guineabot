module.exports = {
	name: "shop",
	category: "economy",
	run: async (client, message) => {
		const techItems = client.economy.shop.filter((item) => {
			return item.category === "Tech";
		});

		return message.channel.send(
			client.embed(
				{
					title: "Item shop",
					description: "Item | ID | Price",
					fields: [
						{
							name: "Tech",
							value: techItems.map((item) => {
								return `${item.name} | ${item.id} | ${item.price}`;
							}).sort((a, b) => {
                                // ASC  -> a.length - b.length
                                // DESC -> b.length - a.length
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
