exports.mochaHooks = {
	beforeAll () {
		process.env.MATCHA_DB = "sekesitest"
		process.env.TEST = "true"
	},
	
	afterAll() {
		process.env.MATCHA_DB = "sekesidbd"
		process.env.TEST = "false"
	}
};