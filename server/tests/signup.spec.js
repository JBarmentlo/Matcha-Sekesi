const { assert } = require('chai');
const sinon		= require('sinon');

const AuthController			  = require('../src/controllers/auth.controller')
const UserController              = require('../src/controllers/user.controller')
const test_con		              = require('../src/controllers/test.controller')
const {mockResponse, mockRequest} = require('./data/res.req.mock');
const users                       = require('./data/users.mock');
const { step } = require('mocha-steps');


const jhonnyBody = {
	username	: 'jhonny',
	mail		: 'joni@gmaill.com',
	lastName	: 'last name',
	firstName	: 'first name',
	password	: 'password',
	zipCode		: 'zipocodo',
	city		: 'city',
	latitude	: 0.0,
	longitude	: 0.0,
}


describe('Test signup', () => {
	let res = mockResponse()
	step("Init db", async () => {
		let res = mockResponse()
		return (Promise.all([
			test_con.clear_db(),
			test_con.create_user_test(mockRequest(users.Jhonny), res),
			test_con.create_user_test(mockRequest(users.Bella), res),
			test_con.create_user_test(mockRequest(users.Mark), res)
		]))
	})
	describe('Create Jhonny user', () => {
		it('should status 200', async () => {
			let req = mockRequest(jhonnyBody)
			let res = mockResponse()
			await AuthController.signup(req, res)
			assert.isTrue(res.status.calledWith(200))
		})
	})
	describe('Create Jhonny user duplicate', () => {
		it('should say username taken', async () => {
			let req = mockRequest(jhonnyBody)
			let res = mockResponse()
			// resp = await db.query('select * from USERS;')
			// console.log("REST: ", resp)
			await AuthController.signup(req, res)
			arg = res.send.getCall(0).firstArg
			assert.isTrue(arg.code == "ER_DUP_ENTRY")
		})
	})
	describe("Create real Joep", () => {
		let hash
		step("Send mail", async () => {
			await AuthController.signup(mockRequest(users.Joep), res)
			hash = res.send.lastCall.firstArg.hash
			await UserController.get_user_by_username(mockRequest(body = {}, username = users.Joep.username, params = {username: users.Joep.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.mailVerified, 0)
			return Promise.resolve()
		})
		step("verify", async () => {
			await AuthController.verifyMail({params:{hash: hash}}, res)
			await UserController.get_user_by_username(mockRequest(body = {}, username = users.Joep.username, params = {username: users.Joep.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.mailVerified, 1)
			return Promise.resolve()
		})
	})
	describe("Signing", () => {
		step("First signin", async () => {
			await AuthController.signin(mockRequest({username: users.Joep.username, password: users.Joep.password}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			return Promise.resolve()
		})
		step("Incorrect pass", async () => {
			await AuthController.signin(mockRequest({username: users.Joep.username, password: 'wrong'}), res)
			assert.equal(res.send.lastCall.firstArg.code, "WRONG_PASSWORD")
			return Promise.resolve()
		})
		step("Incorrect username", async () => {
			await AuthController.signin(mockRequest({username: "jondoe", password: 'wrong'}), res)
			assert.equal(res.send.lastCall.firstArg.code, "MISSING_USERNAME")
			return Promise.resolve()
		})
		step("request password change", async () => {
			await AuthController.requestresetPass(mockRequest({mail: users.Joep.mail}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			return Promise.resolve()
		})
		step("reset password to caca", async () => {
			let hash = res.send.lastCall.firstArg.hash
			let pass = "caca"
			await AuthController.resetPass(mockRequest({hash: hash, password: pass}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			// console.log("SIGL, ", res.send.lastCall.firstArg)
			return Promise.resolve()
		})
		step("login with caca", async () => {
			let pass = "caca"
			await AuthController.signin(mockRequest({username: users.Joep.username, password: pass}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			// console.log(res.send.lastCall.firstArg)
			return Promise.resolve()
		})
	})
	describe("JWT auth", () => {
		step("Login", async () => {
			let pass = "caca"
			await AuthController.signin(mockRequest({username: users.Joep.username, password: pass}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			return Promise.resolve()
		})
		step("Verify headers calls next", async () => {
			let next = sinon.stub()
			await AuthController.verifyToken({ headers: {
												"x-access-token": res.send.lastCall.firstArg.accessToken,
												"x-access-signature": res.send.lastCall.firstArg.signature
											}}, res, next)
			assert.isTrue(next.calledOnce)
			return Promise.resolve()
		})
		step("Incorrect does not call next", async () => {
			let next = sinon.stub()
			await AuthController.verifyToken({ headers: {
												"x-access-token": "res.send.lastCall.firstArg.accessToken",
												"x-access-signature": res.send.lastCall.firstArg.signature
											}}, res, next)
			assert.isFalse(next.calledOnce)
			return Promise.resolve()
		})
		step("Incorrect does not call next", async () => {
			let next = sinon.stub()
			await AuthController.verifyToken({ headers: {
												"x-access-token": res.send.lastCall.firstArg.accessToken,
												"x-access-signature": "res.send.lastCall.firstArg.signature"
											}}, res, next)
			assert.isFalse(next.calledOnce)
		return Promise.resolve()
	})
	})
})