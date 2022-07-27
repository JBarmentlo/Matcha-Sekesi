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
		it('get jhonny with 200', async () => {
			await UserController.get_user_by_username(mockRequest({username: users.Jhonny.username}), res)
			jhonny_id = res.send.lastCall.firstArg.data.id
			assert(res.status.lastCall.args == 200)
		})
		it('get bella with 200', async () => {
			await UserController.get_user_by_username(mockRequest({username: users.Bella.username}), res)
			bella_id = res.send.lastCall.firstArg.data.id
			assert(res.status.lastCall.args == 200)
		})
		it('get mark with 200', async () => {
			await UserController.get_user_by_username(mockRequest({username: users.Mark.username}), res)
			mark_id = res.send.lastCall.firstArg.data.id
			assert(res.status.lastCall.args == 200)
		})
	})
	describe("Create Lonely Mark", () => {
		it('Code Success', async () => {
			await LikeController.like_user(mockRequest({liker_id: mark_id, liked_id: jhonny_id}), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
		})
		it('Code Success', async () => {
			await LikeController.like_user(mockRequest({liker_id: mark_id, liked_id: bella_id}), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
		})
		it('Code Success', async () => {
			await LikeController.like_user(mockRequest({liker_id: bella_id, liked_id: jhonny_id}), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
		})
		it('Code Success', async () => {
			await LikeController.like_user(mockRequest({liker_id: jhonny_id, liked_id: bella_id}), res)
			assert(res.send.lastCall.firstArg.code == "SUCCESS")
		})
		it('Code DUPLICATE', async () => {
			await LikeController.like_user(mockRequest({liker_id: mark_id, liked_id: jhonny_id}), res)
			assert(res.send.lastCall.firstArg.code == "ER_DUP_ENTRY")
		})
	})
})