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
		describe('Create Jhonny, Bella & Mark', () => {
			it('Create Jhonny code SUCESS', async () => {
				let req = mockRequest(users.Jhonny)
				await UserController.create_user_test(req, res)
				jhonny_id = res.send.lastCall.lastArg.id
				assert.equal(res.send.lastCall.lastArg.code, 'SUCCESS')
			})
			it('Create Bella code SUCESS', async () => {
				let req = mockRequest(users.Bella)
				await UserController.create_user_test(req, res)
				assert.isTrue(res.send.lastCall.lastArg.code == 'SUCCESS')
				bella_id = res.send.lastCall.lastArg.id
			})
			it('Create Mark code SUCESS', async () => {
				let req = mockRequest(users.Mark)
				await UserController.create_user_test(req, res)
				assert.isTrue(res.send.lastCall.lastArg.code == 'SUCCESS')
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
	describe('User create errors', () => {
		describe('Duplicate username', () => {
			it('ER_DUP_ENTRY', async () => {
				let req = mockRequest(users.JhonnyDupName)
				await UserController.create_user_test(req, res)
				assert.isTrue(res.status.lastCall.lastArg == 200)
				assert.isTrue(res.send.lastCall.firstArg.code == 'ER_DUP_ENTRY')
			})
			it('with code 200', () => {
				assert.isTrue(res.status.lastCall.lastArg == 200)
			})
		})
	})
})
