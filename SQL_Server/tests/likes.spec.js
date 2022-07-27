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
})
// MISSING_LIKE