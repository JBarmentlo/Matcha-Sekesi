const { assert }                  = require('chai');

const BlockController           = require('../src/controllers/block.controller')
const UserController              = require('../src/controllers/user.controller')
const test_con		              = require('../src/controllers/test.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock');
const { step } = require('mocha-steps');

describe('Test blocks', () => {
	let res = mockResponse()
	step("Init db", async () => {
		return (Promise.all([
			test_con.clear_db(),
			UserController.create_user_test(mockRequest(users.Jhonny), res),
			UserController.create_user_test(mockRequest(users.Bella), res),
			UserController.create_user_test(mockRequest(users.Mark), res)
		]))
	})
	describe("Create blocks", () => {
		step('jhonny   => mark Code SUCCESS', async () => {
			await BlockController.block_user(mockRequest({blocker: users.Jhonny.username, blocked: users.Mark.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			Promise.resolve()
		})
		step('bella => mark Code Success', async ()  => {
			await BlockController.block_user(mockRequest({blocker: users.Bella.username, blocked: users.Mark.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			Promise.resolve()
		})
	})
	describe("Block Error Handling", () => {
		step('duplicate block: Code ER_DUP_ENTRY', async () => {
			await BlockController.block_user(mockRequest({blocker: users.Bella.username, blocked: users.Mark.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "ER_DUP_ENTRY")
			Promise.resolve()
		})
		step('Missing blocked: Code LIKE_MISS', async () => {
			await BlockController.block_user(mockRequest({blocker: users.Mark.username, blocked: 'lol'}), res)
			assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
			Promise.resolve()
		})
		step('Missing blocker: Code LIKE_MISS', async () => {
			await BlockController.block_user(mockRequest({blocker: 'lol', blocked: users.Jhonny.username}), res)
			assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
			Promise.resolve()
		})
	})
	describe("Get blocked Users", () => {
		step("Jhonnies blocks: Mark", async () => {
			let reso = mockResponse()
			await BlockController.get_users_that_i_blocked(mockRequest({blocker_username: users.Jhonny.username}), reso)
			yusers = reso.send.lastCall.firstArg.data.map(function(a) {return a.username})
			assert.isTrue(yusers.includes(users.Mark.username))
			Promise.resolve()
		})
		step("Blocked mark: Bella and jhonny", async () => {
			let reso = mockResponse()
			await BlockController.get_users_that_blocked_me(mockRequest({blocked_username: users.Mark.username}), reso)
			yusers = reso.send.lastCall.firstArg.data.map(function(a) {return a.username})
			assert.isTrue(yusers.includes(users.Bella.username))
			assert.isTrue(yusers.includes(users.Jhonny.username))
			Promise.resolve()
		})
	})
	describe("Unblocking", () => {
		step("Jhonny unblock mark: affects 1 row", async () => {
			await BlockController.un_block_user(mockRequest({unblocker: users.Jhonny.username, unblocked: users.Mark.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.affectedRows, 1)
			Promise.resolve()
		})
		step("Marks's blockers: Jhonny's gone !", async () => {
			await BlockController.get_users_that_blocked_me(mockRequest({blocked_username: users.Mark.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
			Promise.resolve()
		})		
	})

})

// MISSING_LIKE