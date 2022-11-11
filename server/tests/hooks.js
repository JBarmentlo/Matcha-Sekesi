const {mockResponse, mockRequest} = require('./data/res.req.mock')
const UserController              = require('../src/controllers/user.controller')
const users                       = require('./data/users.mock')

exports.mochaHooks = {
	async beforeAll () {
		process.env.MATCHA_DB = "sekesitest"
		process.env.TEST = "true"
		// test_con = require('../src/controllers/test.controller.js')
		// await test_con.clear_db()
		// let res = mockResponse()
		// let req = mockRequest(users.Jhonny)
		// await testController.create_user_test(req, res)
		// req = mockRequest(users.Bella)
		// await testController.create_user_test(req, res)
		// req = mockRequest(users.Mark)
		// await testController.create_user_test(req, res)
	},
	
	async afterAll() {
		// test_con = require('../src/controllers/test.controller')
		// await test_con.clear_db()
		process.env.MATCHA_DB = "sekesidbd"
		process.env.TEST = "false"
	}
};