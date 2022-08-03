const { assert }                  = require('chai');

const BlockController           = require('../src/controllers/block.controller')
const LikeController              = require('../src/controllers/like.controller')
const UserController              = require('../src/controllers/user.controller')
const test_con		              = require('../src/controllers/test.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock');
const { step } = require('mocha-steps');

function sleep(ms) {
	return new Promise((resolve) => {
	  setTimeout(resolve, ms);
	});
  }

describe('Test likes', () => {
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
	describe("Create Lonely Mark", () => {
		step('mark   => jhonny Code SUCCESS', async () => {
			await LikeController.like_user(mockRequest({liked: users.Jhonny.username}, users.Mark.username), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
		})
		step('mark   => bella Code Success', async ()  => {
			await LikeController.like_user(mockRequest({liked: users.Bella.username}, users.Mark.username), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
		})
		step('bella  => jhonny Code Success', async () => {
			await LikeController.like_user(mockRequest({liked: users.Jhonny.username}, users.Bella.username), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
		})
		step('jhonny => bella Code Success', async ()  => {
			await LikeController.like_user(mockRequest({liked: users.Bella.username}, users.Jhonny.username), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
		})
	})
	describe("Like Error Handling", () => {
		step('duplicate like: Code ERR_DUP_ENTRY', async () => {
			await LikeController.like_user(mockRequest({liked: users.Jhonny.username}, users.Mark.username), res)
			assert.equal(res.send.lastCall.firstArg.code, "ER_DUP_ENTRY")
		})
		step('Missing liked: Code LIKE_MISS', async () => {
			await LikeController.like_user(mockRequest({liked: 'lol'}, users.Mark.username), res)
			assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
		})
		step('Missing liker: Code LIKE_MISS', async () => {
			await LikeController.like_user(mockRequest({liked: users.Jhonny.username}, 'lol'), res)
			assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
		})
	})
	describe("Get Liked Users", () => {
		step("Marks liked users:  bella and jhonny", async () => {
			await LikeController.get_users_that_i_liked(mockRequest({liker_username: users.Mark.username}), res)
			yusers = res.send.lastCall.firstArg.data.map(function(a) {return a.username})
			assert.isTrue(yusers.includes(users.Bella.username))
			assert.isTrue(yusers.includes(users.Jhonny.username))
		})
		step("After a block: just bella ", async () => {
			await BlockController.block_user(mockRequest({blocked: users.Jhonny.username}, users.Mark.username,), res)
			await LikeController.get_users_that_i_liked(mockRequest({liker_username: users.Mark.username}), res)
			yusers = res.send.lastCall.firstArg.data.map(function(a) {return a.username})
			assert.isTrue(yusers.includes(users.Bella.username))
			assert.isFalse(yusers.includes(users.Jhonny.username))
			await BlockController.un_block_user(mockRequest({unblocked: users.Jhonny.username}, users.Mark.username), res)
		})
		step("users that like bella: Mard and jhonny", async () => {
			await LikeController.get_users_that_liked_me(mockRequest({liked_username: users.Bella.username}), res)
			yusers = res.send.lastCall.firstArg.data.map(function(a) {return a.username})
			assert.isTrue(yusers.includes(users.Mark.username))
			assert.isTrue(yusers.includes(users.Jhonny.username))
		})
	})
	describe("Get Matches", () => {
		step("Bella's matches: jhonny", async () => {
			await LikeController.get_matches(mockRequest({username: users.Bella.username}), res)
			assert.isTrue(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
			await LikeController.get_matches(mockRequest({username: users.Jhonny.username}), res)
			assert.isTrue(res.send.lastCall.firstArg.data.includes(users.Bella.username))
		})
		step("Marks's matches: All Alone HAHA", async () => {
			await LikeController.get_matches(mockRequest({username: users.Mark.username}), res)
			// assert.isTrue(reso.send.lastCall.firstArg.data.includes(users.Jhonny.username))
			assert.equal(res.send.lastCall.firstArg.data.length, 0)
		})
		step("After a block: bella's alone ", async () => {
			await BlockController.block_user(mockRequest({blocked: users.Bella.username}, users.Jhonny.username), res)
			await LikeController.get_matches(mockRequest({username: users.Bella.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))

			await LikeController.get_matches(mockRequest({username: users.Jhonny.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Bella.username))

			await BlockController.un_block_user(mockRequest({unblocked: users.Bella.username}, users.Jhonny.username), res)
		})
	})
	describe("Unliking", () => {
		step("Jhonny unlike bella: affects 1 row", async () => {
			await LikeController.un_like_user(mockRequest({unliked: users.Bella.username}, users.Jhonny.username), res)
			assert.equal(res.send.lastCall.firstArg.data.affectedRows, 1)
		})
		step("Bella's likers: Jhonny's gone !", async () => {
			await LikeController.get_users_that_liked_me(mockRequest({liked_username: users.Bella.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
		})
		step("Bella's matches: Bye Bye Jhonny", async () => {
			await LikeController.get_matches(mockRequest({username: users.Bella.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
		})
	})
})

// MISSING_LIKE