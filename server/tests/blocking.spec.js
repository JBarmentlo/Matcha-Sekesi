const { assert }                  = require('chai');

const LikeController              = require('../src/controllers/like.controller')
const BlockController             = require('../src/controllers/block.controller')
const test_con                    = require('../src/controllers/test.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock');
const { step }                    = require('mocha-steps');

describe('Test blocking behaviour', () => {
	let res = mockResponse()
	step("Init db", async () => {
		await test_con.clear_db(),
		await test_con.create_user_test(mockRequest(users.Jhonny), res),
		await test_con.create_user_test(mockRequest(users.Bella), res),
		await test_con.create_user_test(mockRequest(users.Mark), res)
		return (Promise.resolve())
	})
	describe("Create blocks", () => {
		step('jhonny blocks mark Code SUCCESS', async () => {
			await BlockController.block_user(mockRequest({blocked: users.Mark.username}, users.Jhonny.username), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			return Promise.resolve()
		})
		step('bella blocks mark Code Success', async ()  => {
			await BlockController.block_user(mockRequest({blocked: users.Mark.username}, users.Bella.username), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			return Promise.resolve()
		})
	})
	describe("Test likes are blocked", () => {
		step("mark like jhonny", async () => {
			await LikeController.like_user(mockRequest({liked: users.Jhonny.username}, users.Mark.username), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			return Promise.resolve()
		})
		step("like doesnt show", async () => {
			await LikeController.get_users_that_liked_me(mockRequest({}, users.Jhonny.username), res)
			assert.equal(res.send.lastCall.firstArg.data.length, 0)
			return Promise.resolve()
		})
	})
})

// MISSING_LIKE