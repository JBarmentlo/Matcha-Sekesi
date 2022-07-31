const { assert }                  = require('chai');

const ConsultController           = require('../src/controllers/consult.controller')
const UserController              = require('../src/controllers/user.controller')
const test_con		              = require('../src/controllers/test.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock')

describe('Test consults', () => {
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
	describe("Create Consults", () => {
		step('mark   => jhonny Code SUCCESS', async (done) => {
			await ConsultController.consult_user(mockRequest({consulter: users.Mark.username, consulted: users.Jhonny.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			done()
		})
		step('mark   => bella Code Success', async (done)  => {
			await ConsultController.consult_user(mockRequest({consulter: users.Mark.username, consulted: users.Bella.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			done()
		})
		step('bella  => jhonny Code Success', async (done) => {
			await ConsultController.consult_user(mockRequest({consulter: users.Bella.username, consulted: users.Jhonny.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			done()
		})
		step('jhonny => bella Code Success', async (done)  => {
			await ConsultController.consult_user(mockRequest({consulter: users.Jhonny.username, consulted: users.Bella.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			done()
		})
	})
	describe("Consult Error Handling", () => {
		step('duplicate consult: Code SUCCESS', async (done) => {
			await ConsultController.consult_user(mockRequest({consulter: users.Mark.username, consulted: users.Jhonny.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			done()
		})
		step('Missing consulted: Code LIKE_MISS', async (done) => {
			await ConsultController.consult_user(mockRequest({consulter: users.Mark.username, consulted: 'lol'}), res)
			assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
			done()
		})
		step('Missing consulter: Code LIKE_MISS', async (done) => {
			await ConsultController.consult_user(mockRequest({consulter: 'lol', consulted: users.Jhonny.username}), res)
			assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
			done()
		})
	})
	describe("Get consulted Users", () => {
		step("Marks consulted users = bella and jhonny", async (done) => {
			let reso = mockResponse()
			await ConsultController.get_users_that_i_consulted(mockRequest({consulter_username: users.Mark.username}), reso)
			yusers = reso.send.lastCall.firstArg.data.map(function(a) {return a.username})
			assert.isTrue(yusers.includes(users.Bella.username))
			assert.isTrue(yusers.includes(users.Jhonny.username))
			done()
		})
		step("users that consulted bella = Mard and jhonny", async (done) => {
			let reso = mockResponse()
			await ConsultController.get_users_that_consulted_me(mockRequest({consulted_username: users.Bella.username}), reso)
			yusers = reso.send.lastCall.firstArg.data.map(function(a) {return a.username})
			assert.isTrue(yusers.includes(users.Mark.username))
			assert.isTrue(yusers.includes(users.Jhonny.username))
			done()
		})
	})
	describe("Get Matches", () => {
		step("Bella's matches = jhonny", async (done) => {
			let reso = mockResponse()
			await ConsultController.get_consult_matches(mockRequest({username: users.Bella.username}), reso)
			assert.isTrue(reso.send.lastCall.firstArg.data.includes(users.Jhonny.username))
			done()
		})
		step("Marks's matches = All Alone HAHA", async (done) => {
			await ConsultController.get_consult_matches(mockRequest({username: users.Mark.username}), res)
			// assert.isTrue(reso.send.lastCall.firstArg.data.includes(users.Jhonny.username))
			assert.equal(res.send.lastCall.firstArg.data.length, 0)
			done()
		})
	})
	describe("Unconsulting", () => {
		step("Jhonny unconsult bella: affects 1 row", async (done) => {
			await ConsultController.un_consult_user(mockRequest({unconsulter: users.Jhonny.username, unconsulted: users.Bella.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.affectedRows, 1)
			done()
		})
		step("Bella's consulters: Jhonny's gone !", async (done) => {
			await ConsultController.get_users_that_consulted_me(mockRequest({consulted_username: users.Bella.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
			done()
		})
		step("Bella's matches: Bye Bye Jhonny", async (done) => {
			await ConsultController.get_consult_matches(mockRequest({username: users.Bella.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
			done()
		})
	})
})

// MISSING_LIKE