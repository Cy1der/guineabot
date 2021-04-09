const util = require("./util");
const express = require("express");
const app = express();

function startSite() {
	app.listen(util.config.site.port, () =>
		util.consola.success("[SITE] Running on port " + util.config.site.port)
	);
}

module.exports = startSite;
