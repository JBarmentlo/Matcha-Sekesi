const { assert }                  = require('chai');

const ConsultController           = require('../src/controllers/consult.controller')
const UserController              = require('../src/controllers/user.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock')

describe('Test consults', () => {
	let res = mockResponse()
	describe("Clear db and make users.", async () => {
		await test_con.clear_db()
		await UserController.create_user_test(mockRequest(users.Jhonny), res)
		await UserController.create_user_test(mockRequest(users.Bella), res)
		await UserController.create_user_test(mockRequest(users.Mark), res)
	})
	describe("Create Consults", () => {
		step('mark   => jhonny Code SUCCESS', async () => {
			await ConsultController.consult_user(mockRequest({consulter: users.Mark.username, consulted: users.Jhonny.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		})
		step('mark   => bella Code Success', async ()  => {
			await ConsultController.consult_user(mockRequest({consulter: users.Mark.username, consulted: users.Bella.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		})
		step('bella  => jhonny Code Success', async () => {
			await ConsultController.consult_user(mockRequest({consulter: users.Bella.username, consulted: users.Jhonny.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		})
		step('jhonny => bella Code Success', async ()  => {
			await ConsultController.consult_user(mockRequest({consulter: users.Jhonny.username, consulted: users.Bella.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		})
	})
	describe("Consult Error Handling", () => {
		describe("duplicate consult", () => {
			step('Code ER_DUP_ENTRY', async () => {
				await ConsultController.consult_user(mockRequest({consulter: users.Mark.username, consulted: users.Jhonny.username}), res)
				assert.equal(res.send.lastCall.firstArg.code, "ER_DUP_ENTRY")
			})
		})
		describe("Missing consulted", () => {
			step('Code LIKE_MISS', async () => {
				await ConsultController.consult_user(mockRequest({consulter: users.Mark.username, consulted: 'lol'}), res)
				assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
			})
		})
		describe("Missing consulter", () => {
			step('Code LIKE_MISS', async () => {
				await ConsultController.consult_user(mockRequest({consulter: 'lol', consulted: users.Jhonny.username}), res)
				assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
			})
		})
	})
	describe("Get consulted Users", () => {
		describe("Get Marks consulted users", () => {
			step("Includes bella and jhonny", async () => {
				let reso = mockResponse()
				await ConsultController.get_users_that_i_consulted(mockRequest({consulter_username: users.Mark.username}), reso)
				yusers = reso.send.lastCall.firstArg.data.map(function(a) {return a.username})
				assert.isTrue(yusers.includes(users.Bella.username))
				assert.isTrue(yusers.includes(users.Jhonny.username))
			})
		})
	})
	describe("Get Users that consulted me", () => {
		describe("Get users that consult bella", () => {
			step("Includes Mard and jhonny", async () => {
				let reso = mockResponse()
				await ConsultController.get_users_that_consulted_me(mockRequest({consulted_username: users.Bella.username}), reso)
				yusers = reso.send.lastCall.firstArg.data.map(function(a) {return a.username})
				assert.isTrue(yusers.includes(users.Mark.username))
				assert.isTrue(yusers.includes(users.Jhonny.username))
			})
		})
	})
	describe("Get Matches", () => {
		describe("Bella's matches", () => {
			step("jhonny", async () => {
				let reso = mockResponse()
				await ConsultController.get_consult_matches(mockRequest({username: users.Bella.username}), reso)
				assert.isTrue(reso.send.lastCall.firstArg.data.includes(users.Jhonny.username))
			})
		})
		describe("Marks's matches", () => {
			step("All Alone HAHA", async () => {
				await ConsultController.get_consult_matches(mockRequest({username: users.Mark.username}), res)
				// assert.isTrue(reso.send.lastCall.firstArg.data.includes(users.Jhonny.username))
				assert.equal(res.send.lastCall.firstArg.data.length, 0)
			})
		})
	})
	describe("Jhonny unconsult bella", () => {
		step("affects 1 row", async () => {
			await ConsultController.un_consult_user(mockRequest({unconsulter: users.Jhonny.username, unconsulted: users.Bella.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.affectedRows, 1)
		})
	})
	describe("Bella's consulters", () => {
		step("Jhonny's gone !", async () => {
			await ConsultController.get_users_that_consulted_me(mockRequest({consulted_username: users.Bella.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
		})
	})
	describe("Bella's matches", () => {
		step("Bye Bye Jhonny", async () => {
			await ConsultController.get_consult_matches(mockRequest({username: users.Bella.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
		})
	})
})

// MISSING_LIKE