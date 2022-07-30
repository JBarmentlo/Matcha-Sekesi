const { assert }                  = require('chai');

const BlockController           = require('../src/controllers/block.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock')

describe('Test blocks', () => {
	let res = mockResponse()

	describe("Create Consults", () => {
		step('mark   => jhonny Code SUCCESS', async () => {
			await BlockController.block_user(mockRequest({blocker: users.Mark.username, blocked: users.Jhonny.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		})
		step('mark   => bella Code Success', async ()  => {
			await BlockController.block_user(mockRequest({blocker: users.Mark.username, blocked: users.Bella.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		})
		step('bella  => jhonny Code Success', async () => {
			await BlockController.block_user(mockRequest({blocker: users.Bella.username, blocked: users.Jhonny.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		})
		step('jhonny => bella Code Success', async ()  => {
			await BlockController.block_user(mockRequest({blocker: users.Jhonny.username, blocked: users.Bella.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		})
	})
	describe("Consult Error Handling", () => {
		describe("duplicate block", () => {
			step('Code ER_DUP_ENTRY', async () => {
				await BlockController.block_user(mockRequest({blocker: users.Mark.username, blocked: users.Jhonny.username}), res)
				assert.equal(res.send.lastCall.firstArg.code, "ER_DUP_ENTRY")
			})
		})
		describe("Missing blocked", () => {
			step('Code LIKE_MISS', async () => {
				await BlockController.block_user(mockRequest({blocker: users.Mark.username, blocked: 'lol'}), res)
				assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
			})
		})
		describe("Missing blocker", () => {
			step('Code LIKE_MISS', async () => {
				await BlockController.block_user(mockRequest({blocker: 'lol', blocked: users.Jhonny.username}), res)
				assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
			})
		})
	})
	describe("Get blocked Users", () => {
		describe("Get Marks blocked users", () => {
			step("Includes bella and jhonny", async () => {
				let reso = mockResponse()
				await BlockController.get_users_that_i_blocked(mockRequest({blocker_username: users.Mark.username}), reso)
				yusers = reso.send.lastCall.firstArg.data.map(function(a) {return a.username})
				assert.isTrue(yusers.includes(users.Bella.username))
				assert.isTrue(yusers.includes(users.Jhonny.username))
			})
		})
	})
	describe("Get Users that blocked me", () => {
		describe("Get users that block bella", () => {
			step("Includes Mard and jhonny", async () => {
				let reso = mockResponse()
				await BlockController.get_users_that_blocked_me(mockRequest({blocked_username: users.Bella.username}), reso)
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
				await BlockController.get_block_matches(mockRequest({username: users.Bella.username}), reso)
				assert.isTrue(reso.send.lastCall.firstArg.data.includes(users.Jhonny.username))
			})
		})
		describe("Marks's matches", () => {
			step("All Alone HAHA", async () => {
				await BlockController.get_block_matches(mockRequest({username: users.Mark.username}), res)
				// assert.isTrue(reso.send.lastCall.firstArg.data.includes(users.Jhonny.username))
				assert.equal(res.send.lastCall.firstArg.data.length, 0)
			})
		})
	})
	describe("Jhonny unblock bella", () => {
		step("affects 1 row", async () => {
			await BlockController.un_block_user(mockRequest({unblocker: users.Jhonny.username, unblocked: users.Bella.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.affectedRows, 1)
		})
	})
	describe("Bella's blockers", () => {
		step("Jhonny's gone !", async () => {
			await BlockController.get_users_that_blocked_me(mockRequest({blocked_username: users.Bella.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
		})
	})
	describe("Bella's matches", () => {
		step("Bye Bye Jhonny", async () => {
			await BlockController.get_block_matches(mockRequest({username: users.Bella.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
		})
	})
})

// MISSING_LIKE