const { assert }                  = require('chai');

const LikeController              = require('../src/controllers/like.controller')
const UserController              = require('../src/controllers/user.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock')

describe('Test likes', () => {
	let res = mockResponse()
	// let jhonny_id
	// let bella_id
	// let mark_id
	
	// describe('Get Users by username', () => {
	// 		it('Jhonny status 200', async () => {
	// 			await UserController.get_user_by_username(mockRequest({username: users.Jhonny.username}), res)
	// 			jhonny_id = res.send.lastCall.firstArg.data.id
	// 			assert(res.status.lastCall.args == 200)
	// 		})
	// 		it('Bella status 200', async () => {
	// 			await UserController.get_user_by_username(mockRequest({username: users.Bella.username}), res)
	// 			bella_id = res.send.lastCall.firstArg.data.id
	// 			assert(res.status.lastCall.args == 200)
	// 		})
	// 		it('Mark status 200', async () => {
	// 		await UserController.get_user_by_username(mockRequest({username: users.Mark.username}), res)
	// 		mark_id = res.send.lastCall.firstArg.data.id
	// 		assert(res.status.lastCall.args == 200)
	// 	})
	// })
	describe("Create Lonely Mark", () => {
		it('mark   => jhonny Code SUCCESS', async () => {
			await LikeController.like_user(mockRequest({liker: users.Mark.username, liked: users.Jhonny.username}), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
		})
		it('mark   => bella Code Success', async ()  => {
			await LikeController.like_user(mockRequest({liker: users.Mark.username, liked: users.Bella.username}), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
		})
		it('bella  => jhonny Code Success', async () => {
			await LikeController.like_user(mockRequest({liker: users.Bella.username, liked: users.Jhonny.username}), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
		})
		it('jhonny => bella Code Success', async ()  => {
			await LikeController.like_user(mockRequest({liker: users.Jhonny.username, liked: users.Bella.username}), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
		})
	})
	describe("Like Error Handling", () => {
		describe("duplicate like", () => {
			it('Code ER_DUP_ENTRY', async () => {
				await LikeController.like_user(mockRequest({liker: users.Mark.username, liked: users.Jhonny.username}), res)
				assert.equal(res.send.lastCall.firstArg.code, "ER_DUP_ENTRY")
			})
		})
		describe("Missing liked", () => {
			it('Code LIKE_MISS', async () => {
				await LikeController.like_user(mockRequest({liker: users.Mark.username, liked: 'lol'}), res)
				assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
			})
		})
		describe("Missing liker", () => {
			it('Code LIKE_MISS', async () => {
				await LikeController.like_user(mockRequest({liker: 'lol', liked: users.Jhonny.username}), res)
				assert.equal(res.send.lastCall.firstArg.code,  "ER_NO_REFERENCED_ROW")
			})
		})
	})
	describe("Get Liked Users", () => {
		describe("Get Marks liked users", () => {
			it("Includes bella and jhonny", async () => {
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
			it("Includes Mard and jhonny", async () => {
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
			it("jhonny", async () => {
				let reso = mockResponse()
				await LikeController.get_matches(mockRequest({username: users.Bella.username}), reso)
				assert.isTrue(reso.send.lastCall.firstArg.data.includes(users.Jhonny.username))
			})
		})
		describe("Marks's matches", () => {
			it("All Alone HAHA", async () => {
				await LikeController.get_matches(mockRequest({username: users.Mark.username}), res)
				// assert.isTrue(reso.send.lastCall.firstArg.data.includes(users.Jhonny.username))
				assert.equal(res.send.lastCall.firstArg.data.length, 0)
			})
		})
	})
	describe("Jhonny unlike bella", () => {
		it("affects 1 row", async () => {
			await LikeController.un_like_user(mockRequest({unliker: users.Jhonny.username, unliked: users.Bella.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.affectedRows, 1)
		})
	})
	describe("Bella's likers", () => {
		it("Jhonny's gone !", async () => {
			await LikeController.get_users_that_liked_me(mockRequest({liked_username: users.Bella.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
		})
	})
	describe("Bella's matches", () => {
		it("Bye Bye Jhonny", async () => {
			await LikeController.get_matches(mockRequest({username: users.Bella.username}), res)
			assert.isFalse(res.send.lastCall.firstArg.data.includes(users.Jhonny.username))
		})
	})
})

// MISSING_LIKE