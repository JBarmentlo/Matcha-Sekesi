const { assert }                  = require('chai');

const LikeController              = require('../src/controllers/like.controller')
const UserController              = require('../src/controllers/user.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock')

describe('Test likes', () => {
	let res = mockResponse()
	describe("Clear db and make users.", async () => {
		await test_con.clear_db()
		await UserController.create_user_test(mockRequest(users.Jhonny), res)
		await UserController.create_user_test(mockRequest(users.Bella), res)
		await UserController.create_user_test(mockRequest(users.Mark), res)
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
		describe("duplicate like", () => {
			step('Code ER_DUP_ENTRY', async () => {
				await LikeController.like_user(mockRequest({liker: users.Mark.username, liked: users.Jhonny.username}), res)
				assert.equal(res.send.lastCall.firstArg.code, "ER_DUP_ENTRY")
			})
		})
		describe("Missing liked", () => {
			step('Code LIKE_MISS', async () => {
				await LikeController.like_user(mockRequest({liker: users.Mark.username, liked: 'lol'}), res)
				assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
			})
		})
		describe("Missing liker", () => {
			step('Code LIKE_MISS', async () => {
				await LikeController.like_user(mockRequest({liker: 'lol', liked: users.Jhonny.username}), res)
				assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
			})
		})
	})
	describe("Get Liked Users", () => {
		describe("Get Marks liked users", () => {
			step("Includes bella and jhonny", async () => {
				let reso = mockResponse()
				await LikeController.get_users_that_i_liked(mockRequest({liker_username: users.Mark.username}), reso)
				yusers = reso.send.lastCall.firstArg.data.map(function(a) {return a.username})
				assert.isTrue(yusers.includes(users.Bella.username))
				assert.isTrue(yusers.includes(users.Jhonny.username))
			})
		})
	})
	describe("Get Users that liked me", () => {
		describe("Get users that like bella", () => {
			step("Includes Mard and jhonny", async () => {
				let reso = mockResponse()
				await LikeController.get_users_that_liked_me(mockRequest({liked_username: users.Bella.username}), reso)
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
				await LikeController.get_matches(mockRequest({username: users.Bella.username}), reso)
				assert.isTrue(reso.send.lastCall.firstArg.data.includes(users.Jhonny.username))
			})
		})
		describe("Marks's matches", () => {
			step("All Alone HAHA", async () => {
				await LikeController.get_matches(mockRequest({username: users.Mark.username}), res)
				// assert.isTrue(reso.send.lastCall.firstArg.data.includes(users.Jhonny.username))
				assert.equal(res.send.lastCall.firstArg.data.length, 0)
			})
		})
	})
	describe("Jhonny unlike bella", () => {
		step("affects 1 row", async () => {
			await LikeController.un_like_user(mockRequest({unliker: users.Jhonny.username, unliked: users.Bella.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.affectedRows, 1)
		})
	})
	describe("Bella's likers", () => {
		step("Jhonny's gone !", async () => {
			await LikeController.get_users_that_liked_me(mockRequest({liked_username: users.Bella.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
		})
	})
	describe("Bella's matches", () => {
		step("Bye Bye Jhonny", async () => {
			await LikeController.get_matches(mockRequest({username: users.Bella.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
		})
	})
})

// MISSING_LIKE