const { assert }                  = require('chai');

const UserController              = require('../src/controllers/user.controller')
const test_con		              = require('../src/controllers/test.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock');
const { step } = require('mocha-steps');


describe('Test users', () => {
	let res = mockResponse()
	step("Init db", async () => {
		let res = mockResponse()
		return (Promise.all([
			test_con.clear_db(),
			UserController.create_user_test(mockRequest(users.Jhonny), res),
			UserController.create_user_test(mockRequest(users.Bella), res),
			UserController.create_user_test(mockRequest(users.Mark), res)
		]))
	})
	describe('User create errors', () => {
		step('Duplicate username: ER_DUP_ENTRY', async (done) => {
			let res = mockResponse()
			let req = mockRequest(users.JhonnyDupName)
			await UserController.create_user_test(req, res)
			assert.isTrue(res.status.lastCall.lastArg == 200)
			assert.isTrue(res.send.lastCall.firstArg.code == 'ER_DUP_ENTRY')
			done()
		})
		step('Too long field: ER_DATA_TOO_LONG', async () => {
			var user = JSON.parse(JSON.stringify(users.JhonnyDupName));
			user.username = "LKJHSDFLKJHSDFLKJHSDLFKJHSDFKLJHSDLFKJSD<>FMN>XC<VN><XCMNFV>KJSHDFLKJHSDFGKJHSDFKJHSDLFKJHSDLFKJHSDLKFJHSDLFKJHSLDFKJHSDFLKJHSDLFKLjh"
			let res = mockResponse()
			let req = mockRequest(user)
			await UserController.create_user_test(req, res)
			assert.equal(res.status.lastCall.lastArg, 200)
			assert.equal(res.send.lastCall.firstArg.code, 'ER_DATA_TOO_LONG')
		})
		step('Null field: ER_BAD_NULL_ERROR', async (done) => {
			var yuser = JSON.parse(JSON.stringify(users.JhonnyDupName));
			yuser.username = null
			let res = mockResponse()
			let req = mockRequest(yuser)
			await UserController.create_user_test(req, res)
			assert.equal(res.status.lastCall.lastArg, 200)
			assert.equal(res.send.lastCall.firstArg.code, 'ER_BAD_NULL_ERROR')
			done()
		})
	})
	describe("User updates", () => {
		step('Updated jhonny', async () => {
			let res = mockResponse()
			await UserController.update_user_test(mockRequest({update: {zipCode: 'lol'}, username: users.Jhonny.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, 'SUCCESS')
			assert.equal(res.send.lastCall.firstArg.data.affectedRows, 1)
		})
		step("get jhonny modified", async () => {
			await UserController.get_user_by_username(mockRequest({username: users.Jhonny.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.zipCode, 'lol')
		})
	})
})
