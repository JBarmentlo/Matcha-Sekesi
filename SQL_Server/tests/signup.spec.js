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
			UserController.create_user_test(mockRequest(users.Jhonny), res),
			UserController.create_user_test(mockRequest(users.Bella), res),
			UserController.create_user_test(mockRequest(users.Mark), res)
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
		step("Send mail", async (done) => {
			await AuthController.signup(mockRequest(users.Joep), res)
			hash = res.send.lastCall.firstArg.hash
			await UserController.get_user_by_username(mockRequest({username: users.Joep.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.mailVerified, 0)
			done()
		})
		step("verify", async (done) => {
			await AuthController.verifyMail({params:{idHash: hash}}, res)
			await UserController.get_user_by_username(mockRequest({username: users.Joep.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.mailVerified, 1)
			done()
		})
	})
	describe("Signing", () => {
		step("First signin", async (done) => {
			await AuthController.signin(mockRequest({username: users.Joep.username, password: users.Joep.password}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			done()
		})
		step("Incorrect pass", async (done) => {
			await AuthController.signin(mockRequest({username: users.Joep.username, password: 'wrong'}), res)
			assert.equal(res.send.lastCall.firstArg.code, "WRONG_PASSWORD")
			done()
		})
		step("Incorrect username", async (done) => {
			await AuthController.signin(mockRequest({username: "jondoe", password: 'wrong'}), res)
			assert.equal(res.send.lastCall.firstArg.code, "MISSING_USERNAME")
			done()
		})
		step("request password change", async (done) => {
			await AuthController.requestresetPass(mockRequest({mail: users.Joep.mail}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			done()
		})
		step("reset password to caca", async (done) => {
			let hash = res.send.lastCall.firstArg.hash
			let pass = "caca"
			await AuthController.resetPass(mockRequest({id_hash: hash, password: pass}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			// console.log("SIGL, ", res.send.lastCall.firstArg)
			done()
		})
		step("login with caca", async (done) => {
			let pass = "caca"
			await AuthController.signin(mockRequest({username: users.Joep.username, password: pass}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			// console.log(res.send.lastCall.firstArg)
			done()
		})
	})
	describe("JWT auth", () => {
		step("Login", async (done) => {
			let pass = "caca"
			await AuthController.signin(mockRequest({username: users.Joep.username, password: pass}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			done()
		})
		step("Verify headers calls next", async (done) => {
			let next = sinon.stub()
			await AuthController.verifyToken({ headers: {
												"x-access-token": res.send.lastCall.firstArg.accessToken,
												"x-access-signature": res.send.lastCall.firstArg.signature
											}}, res, next)
			assert.isTrue(next.calledOnce)
			done()
		})
		step("Incorrect does not call next", async (done) => {
			let next = sinon.stub()
			await AuthController.verifyToken({ headers: {
												"x-access-token": "res.send.lastCall.firstArg.accessToken",
												"x-access-signature": res.send.lastCall.firstArg.signature
											}}, res, next)
			assert.isFalse(next.calledOnce)
			done()
		})
		step("Incorrect does not call next", async (done) => {
			let next = sinon.stub()
			await AuthController.verifyToken({ headers: {
												"x-access-token": res.send.lastCall.firstArg.accessToken,
												"x-access-signature": "res.send.lastCall.firstArg.signature"
											}}, res, next)
			assert.isFalse(next.calledOnce)
		done()
	})
	})
})