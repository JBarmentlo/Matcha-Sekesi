const { assert }                  = require('chai');

const LikeController              = require('../src/controllers/like.controller')
const UserController              = require('../src/controllers/user.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock')

describe('Test likes', () => {
	let res = mockResponse()
	let jhonny_id
	let bella_id
	let mark_id
	
	describe('Get Users by username', () => {
		describe('Jhonny', () => {
			it('status 200', async () => {
				await UserController.get_user_by_username(mockRequest({username: users.Jhonny.username}), res)
				jhonny_id = res.send.lastCall.firstArg.data.id
				assert(res.status.lastCall.args == 200)
			})
		})
		describe('Bella', () => {
			it('status 200', async () => {
				await UserController.get_user_by_username(mockRequest({username: users.Bella.username}), res)
				bella_id = res.send.lastCall.firstArg.data.id
				assert(res.status.lastCall.args == 200)
			})
		})
		describe('Mark', () => {
			it('status 200', async () => {
			await UserController.get_user_by_username(mockRequest({username: users.Mark.username}), res)
			mark_id = res.send.lastCall.firstArg.data.id
			assert(res.status.lastCall.args == 200)
		})
	})
	})
	describe("Create Lonely Mark", () => {
		describe("mark => jhonny", () => {
			it('Code SUCCESS', async () => {
				await LikeController.like_user(mockRequest({liker_id: mark_id, liked_id: jhonny_id}), res)
				assert(res.send.lastCall.firstArg.code == "SUCCESS")
			})
		})
		describe("mark => bella", () => {
			it('Code Success', async () => {
				await LikeController.like_user(mockRequest({liker_id: mark_id, liked_id: bella_id}), res)
				assert(res.send.lastCall.firstArg.code == "SUCCESS")
			})
		})
		describe("bella => jhonny", () => {
			it('Code Success', async () => {
				await LikeController.like_user(mockRequest({liker_id: bella_id, liked_id: jhonny_id}), res)
				assert(res.send.lastCall.firstArg.code == "SUCCESS")
			})
		})
		describe("jhonny => bella", () => {
			it('Code Success', async () => {
				await LikeController.like_user(mockRequest({liker_id: jhonny_id, liked_id: bella_id}), res)
				assert(res.send.lastCall.firstArg.code == "SUCCESS")
			})
		})
	})
	describe("Like Error Handling", () => {
		describe("duplicate like", () => {
			it('Code ER_DUP_ENTRY', async () => {
				await LikeController.like_user(mockRequest({liker_id: mark_id, liked_id: jhonny_id}), res)
				assert.equal(res.send.lastCall.firstArg.code, "ER_DUP_ENTRY")
			})
		})
		describe("Missing liked", () => {
			it('Code LIKE_MISS', async () => {
				await LikeController.like_user(mockRequest({liker_id: mark_id, liked_id: 'lol'}), res)
				assert.equal(res.send.lastCall.firstArg.code,  "LIKE_MISS")
			})
		})
		describe("Missing liker", () => {
			it('Code LIKE_MISS', async () => {
				await LikeController.like_user(mockRequest({liker_id: 'lol', liked_id: jhonny_id}), res)
				assert.equal(res.send.lastCall.firstArg.code,  "LIKE_MISS")
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
})

// MISSING_LIKE