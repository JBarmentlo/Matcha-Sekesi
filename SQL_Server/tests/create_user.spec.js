const { assert }                  = require('chai');

const UserController              = require('../src/controllers/user.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock')


describe('Test users', () => {
	let res = mockResponse()
	let jhonny_id
	let bella_id
	let mark_id
	
	// describe('Get Users', () => {
	// 	describe('Get Jhonny by id', () => {
	// 		step('should return jhonny', async () => {
	// 			let req = mockRequest({id: jhonny_id})
	// 			await UserController.get_user_by_id(req, res)
	// 			assert.isTrue(res.status.lastCall.lastArg == 200)
	// 			assert.isTrue(res.send.lastCall.firstArg.data.username == users.Jhonny.username)
	// 		})
	// 		step('with code 200', () => {
	// 			assert.isTrue(res.status.lastCall.lastArg == 200)
	// 		})
	// 	})
	// })
	describe('User create errors', () => {
		describe('Duplicate username', () => {
			step('ER_DUP_ENTRY', async () => {
				let req = mockRequest(users.JhonnyDupName)
				await UserController.create_user_test(req, res)
				assert.isTrue(res.status.lastCall.lastArg == 200)
				assert.isTrue(res.send.lastCall.firstArg.code == 'ER_DUP_ENTRY')
			})
			step('with code 200', () => {
				assert.isTrue(res.status.lastCall.lastArg == 200)
			})
		})
	})
})
