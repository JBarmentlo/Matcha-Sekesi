const { assert }                  = require('chai');

const BlockController           = require('../src/controllers/block.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock')

describe('Test blocks', () => {
	let res = mockResponse()

	describe("Create blocks", () => {
		step('jhonny   => mark Code SUCCESS', async () => {
			await BlockController.block_user(mockRequest({blocker: users.Jhonny.username, blocked: users.Mark.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		})
		step('bella => mark Code Success', async ()  => {
			await BlockController.block_user(mockRequest({blocker: users.Bella.username, blocked: users.Mark.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		})
	})
	describe("Block Error Handling", () => {
		step('duplicate block: Code ER_DUP_ENTRY', async () => {
			await BlockController.block_user(mockRequest({blocker: users.Bella.username, blocked: users.Mark.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "ER_DUP_ENTRY")
		})
		step('Missing blocked: Code LIKE_MISS', async () => {
			await BlockController.block_user(mockRequest({blocker: users.Mark.username, blocked: 'lol'}), res)
			assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
		})
		step('Missing blocker: Code LIKE_MISS', async () => {
			await BlockController.block_user(mockRequest({blocker: 'lol', blocked: users.Jhonny.username}), res)
			assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
		})
	})
	describe("Get blocked Users", () => {
		step("Jhonnies blocks: Mark", async () => {
			let reso = mockResponse()
			await BlockController.get_users_that_i_blocked(mockRequest({blocker_username: users.Jhonny.username}), reso)
			yusers = reso.send.lastCall.firstArg.data.map(function(a) {return a.username})
			assert.isTrue(yusers.includes(users.Mark.username))
		})
		step("Blocked mark: Bella and jhonny", async () => {
			let reso = mockResponse()
			await BlockController.get_users_that_blocked_me(mockRequest({blocked_username: users.Mark.username}), reso)
			yusers = reso.send.lastCall.firstArg.data.map(function(a) {return a.username})
			assert.isTrue(yusers.includes(users.Bella.username))
			assert.isTrue(yusers.includes(users.Jhonny.username))
		})
	})
	describe("Unblocking", () => {
		step("Jhonny unblock mark: affects 1 row", async () => {
			await BlockController.un_block_user(mockRequest({unblocker: users.Jhonny.username, unblocked: users.Mark.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.affectedRows, 1)
		})
		step("Marks's blockers: Jhonny's gone !", async () => {
			await BlockController.get_users_that_blocked_me(mockRequest({blocked_username: users.Mark.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
		})		
	})

})

// MISSING_LIKE