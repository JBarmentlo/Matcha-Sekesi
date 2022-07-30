const { assert }                  = require('chai');

const LikeController              = require('../src/controllers/like.controller')
const UserController              = require('../src/controllers/user.controller')
const test_con		              = require('../src/controllers/test.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock')

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
			await LikeController.like_user(mockRequest({liker: users.Mark.username, liked: users.Jhonny.username}), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
		})
		step('mark   => bella Code Success', async ()  => {
			await LikeController.like_user(mockRequest({liker: users.Mark.username, liked: users.Bella.username}), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
		})
		step('bella  => jhonny Code Success', async () => {
			await LikeController.like_user(mockRequest({liker: users.Bella.username, liked: users.Jhonny.username}), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
		})
		step('jhonny => bella Code Success', async ()  => {
			await LikeController.like_user(mockRequest({liker: users.Jhonny.username, liked: users.Bella.username}), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
		})
	})
	describe("Like Error Handling", () => {
		step('duplicate like: Code ER_DUP_ENTRY', async () => {
			await LikeController.like_user(mockRequest({liker: users.Mark.username, liked: users.Jhonny.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "ER_DUP_ENTRY")
		})
		step('Missing liked: Code LIKE_MISS', async () => {
			await LikeController.like_user(mockRequest({liker: users.Mark.username, liked: 'lol'}), res)
			assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
		})
		step('Missing liker: Code LIKE_MISS', async () => {
			await LikeController.like_user(mockRequest({liker: 'lol', liked: users.Jhonny.username}), res)
			assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
		})
	})
	describe("Get Liked Users", () => {
		step("Marks liked users:  bella and jhonny", async () => {
			let reso = mockResponse()
			await LikeController.get_users_that_i_liked(mockRequest({liker_username: users.Mark.username}), reso)
			yusers = reso.send.lastCall.firstArg.data.map(function(a) {return a.username})
			assert.isTrue(yusers.includes(users.Bella.username))
			assert.isTrue(yusers.includes(users.Jhonny.username))
		})
		step("users that like bella: Mard and jhonny", async () => {
			let reso = mockResponse()
			await LikeController.get_users_that_liked_me(mockRequest({liked_username: users.Bella.username}), reso)
			yusers = reso.send.lastCall.firstArg.data.map(function(a) {return a.username})
			assert.isTrue(yusers.includes(users.Mark.username))
			assert.isTrue(yusers.includes(users.Jhonny.username))
		})
		})
	describe("Get Matches", () => {
		step("Bella's matches: jhonny", async () => {
			let reso = mockResponse()
			await LikeController.get_matches(mockRequest({username: users.Bella.username}), reso)
			assert.isTrue(reso.send.lastCall.firstArg.data.includes(users.Jhonny.username))
		})
		step("Marks's matches: All Alone HAHA", async () => {
			await LikeController.get_matches(mockRequest({username: users.Mark.username}), res)
			// assert.isTrue(reso.send.lastCall.firstArg.data.includes(users.Jhonny.username))
			assert.equal(res.send.lastCall.firstArg.data.length, 0)
		})
	})
	describe("Unliking", () => {
		step("Jhonny unlike bella: affects 1 row", async () => {
			await LikeController.un_like_user(mockRequest({unliker: users.Jhonny.username, unliked: users.Bella.username}), res)
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