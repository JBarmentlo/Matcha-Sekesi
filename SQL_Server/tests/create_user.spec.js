const { assert }                  = require('chai');

const UserController              = require('../src/controllers/user.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock')


describe('Test users', () => {
	let res = mockResponse()
	let jhonny_id
	let bella_id
	let mark_id
	
	describe('Create Users', () => {
		describe('Create Jhonny', () => {
			it('should call 200', async () => {
				let req = mockRequest(users.Jhonny)
				await UserController.create_user_test(req, res)
				assert.isTrue(res.status.lastCall.lastArg == 200)
				jhonny_id = res.send.lastCall.lastArg.id
			})
		})
		describe('Create Bella', () => {
			it('should call 200', async () => {
				let req = mockRequest(users.Bella)
				await UserController.create_user_test(req, res)
				assert.isTrue(res.status.lastCall.lastArg == 200)
				bella_id = res.send.lastCall.lastArg.id
			})
		})
		describe('Create Mark', () => {
			it('should call 200', async () => {
				let req = mockRequest(users.Mark)
				await UserController.create_user_test(req, res)
				assert.isTrue(res.status.lastCall.lastArg == 200)
				mark_id = res.send.lastCall.lastArg.id
			})
		})
	})
	describe('Get Users', () => {
		describe('Get Jhonny by id', () => {
			it('should return jhonny', async () => {
				let req = mockRequest({id: jhonny_id})
				await UserController.get_user_by_id(req, res)
				assert.isTrue(res.status.lastCall.lastArg == 200)
				assert.isTrue(res.send.lastCall.firstArg.data.username == users.Jhonny.username)
			})
			it('with code 200', () => {
				assert.isTrue(res.status.lastCall.lastArg == 200)
			})
		})
	})
})