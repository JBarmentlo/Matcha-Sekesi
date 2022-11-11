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
			test_con.create_user_test(mockRequest(users.Jhonny), res),
			test_con.create_user_test(mockRequest(users.Bella), res),
			test_con.create_user_test(mockRequest(users.Mark), res)
		]))
	})
	describe('User create errors', () => {
		step('Duplicate username: ER_DUP_ENTRY', async () => {
			let res = mockResponse()
			let req = mockRequest(users.JhonnyDupName)
			await test_con.create_user_test(req, res)
			assert.isTrue(res.status.lastCall.lastArg == 200)
			assert.isTrue(res.send.lastCall.firstArg.code == 'ER_DUP_ENTRY')
			return Promise.resolve()
		})
		step('Too long field: ER_DATA_TOO_LONG', async () => {
			var user = JSON.parse(JSON.stringify(users.JhonnyDupName));
			user.username = "LKJHSDFLKJHSDFLKJHSDLFKJHSDFKLJHSDLFKJSD<>FMN>XC<VN><XCMNFV>KJSHDFLKJHSDFGKJHSDFKJHSDLFKJHSDLFKJHSDLKFJHSDLFKJHSLDFKJHSDFLKJHSDLFKLjh"
			let res = mockResponse()
			let req = mockRequest(user)
			await test_con.create_user_test(req, res)
			assert.equal(res.status.lastCall.lastArg, 200)
			assert.equal(res.send.lastCall.firstArg.code, 'ER_DATA_TOO_LONG')
			return Promise.resolve()
		})
		step('Null field: ER_BAD_NULL_ERROR', async () => {
			var yuser = JSON.parse(JSON.stringify(users.JhonnyDupName));
			yuser.username = null
			let res = mockResponse()
			let req = mockRequest(yuser)
			await test_con.create_user_test(req, res)
			assert.equal(res.status.lastCall.lastArg, 200)
			assert.equal(res.send.lastCall.firstArg.code, 'ER_BAD_NULL_ERROR')
			return Promise.resolve()
		})
	})
	describe("User updates", () => {
		step('Updated jhonny', async () => {
			let res = mockResponse()
			await UserController.update_user_test(mockRequest({update: {zipCode: 'lol', mail: "newmail@mail.com"}}, users.Jhonny.username), res)
			assert.equal(res.send.lastCall.firstArg.code, 'SUCCESS')
			assert.equal(res.send.lastCall.firstArg.data.affectedRows, 1)
			return Promise.resolve()
		})
		step("modified mail is unverified", async () => {
			await UserController.get_user_by_username(mockRequest(body = {username: users.Jhonny.username}, username = 'bella', params = {username: users.Jhonny.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.mailVerified, 0)
			return Promise.resolve()
		})
		step("get jhonny modified", async () => {
			await UserController.get_my_user(mockRequest(body = {}, username = users.Jhonny.username), res)
			assert.equal(res.send.lastCall.firstArg.data.zipCode, 'lol')
			return Promise.resolve()
		})
	})
})
