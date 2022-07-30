exports.mochaHooks = {
	beforeAll () {
		process.env.MATCHA_DB = "sekesitest"
		process.env.TEST = "true"
		test_con = require('../src/controllers/test.controller')
		return test_con.clear_db()
	},
	
	async afterAll() {
		test_con = require('../src/controllers/test.controller')
		await test_con.clear_db()
		process.env.MATCHA_DB = "sekesidbd"
		process.env.TEST = "false"
	}
};