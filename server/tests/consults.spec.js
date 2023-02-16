const { assert }                  = require('chai');

const ConsultController           = require('../src/controllers/consult.controller')
const testController              = require('../src/controllers/test.controller')
const test_con		              = require('../src/controllers/test.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock')

describe('Test consults', () => {
	let res = mockResponse()
	step("Init db", async () => {
		await test_con.clear_db(),
		await test_con.create_user_test(mockRequest(users.Jhonny), res),
		await test_con.create_user_test(mockRequest(users.Bella), res),
		await test_con.create_user_test(mockRequest(users.Mark), res)
		return (Promise.resolve())
	})
	describe("Create Consults", () => {
		step('mark   => jhonny Code SUCCESS', async () => {
			await ConsultController.consult_user_old(mockRequest({consulted: users.Jhonny.username}, users.Mark.username), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			return Promise.resolve()
		})
		step('mark   => bella Code Success', async ()  => {
			await ConsultController.consult_user_old(mockRequest({consulted: users.Bella.username}, users.Mark.username), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			return Promise.resolve()
		})
		step('bella  => jhonny Code Success', async () => {
			await ConsultController.consult_user_old(mockRequest({consulted: users.Jhonny.username}, users.Bella.username), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			return Promise.resolve()
		})
		step('jhonny => bella Code Success', async ()  => {
			await ConsultController.consult_user_old(mockRequest({consulted: users.Bella.username}, users.Jhonny.username), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			return Promise.resolve()
		})
	})
	describe("Consult Error Handling", () => {
		step('duplicate consult: Code SUCCESS', async () => {
			await ConsultController.consult_user_old(mockRequest({consulted: users.Jhonny.username}, users.Mark.username), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			return Promise.resolve()
		})
		step('Missing consulted: Code LIKE_MISS', async () => {
			await ConsultController.consult_user_old(mockRequest({consulted: 'lol'}, users.Mark.username), res)
			assert.equal((res.send.lastCall.firstArg.code == "ER_NO_REFERENCED_ROW_2") || (res.send.lastCall.firstArg.code == "ER_NO_REFERENCED_ROW"), true)
			return Promise.resolve()
		})
		step('Missing consulter: Code LIKE_MISS', async () => {
			await ConsultController.consult_user_old(mockRequest({consulted: users.Jhonny.username}, 'lol'), res)
			assert.equal((res.send.lastCall.firstArg.code == "ER_NO_REFERENCED_ROW_2") || (res.send.lastCall.firstArg.code == "ER_NO_REFERENCED_ROW"), true)
			return Promise.resolve()
		})
	})
	describe("Get consulted Users", () => {
		step("Marks consulted users = bella and jhonny", async () => {
			let reso = mockResponse()
			await ConsultController.get_users_that_i_consulted(mockRequest({},users.Mark.username), reso)
			yusers = reso.send.lastCall.firstArg.data.map(function(a) {return a.username})
			assert.isTrue(yusers.includes(users.Bella.username))
			assert.isTrue(yusers.includes(users.Jhonny.username))
			return Promise.resolve()
		})
		step("users that consulted bella = Mard and jhonny", async () => {
			let reso = mockResponse()
			await ConsultController.get_users_that_consulted_me(mockRequest({}, users.Bella.username), reso)
			yusers = reso.send.lastCall.firstArg.data.map(function(a) {return a.username})
			assert.isTrue(yusers.includes(users.Mark.username))
			assert.isTrue(yusers.includes(users.Jhonny.username))
			return Promise.resolve()
		})
	})
})

// MISSING_LIKE