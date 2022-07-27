exports.mochaHooks = {
	async beforeAll () {
		process.env.MATCHA_DB = "sekesitest"
		process.env.TEST = "true"
		db = require('../src/db/sql.conn')
		await db.drop_all()
	},
	
	afterAll() {
		process.env.MATCHA_DB = "sekesidbd"
		process.env.TEST = "false"
	}
};