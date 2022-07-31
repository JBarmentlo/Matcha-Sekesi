const { assert } = require('chai');
const sinon		= require('sinon');

const AuthController	= require('../src/controllers/auth.controller')
const UserController              = require('../src/controllers/user.controller')
const test_con		              = require('../src/controllers/test.controller')
const users                       = require('./data/users.mock')

const mockResponse = () => {
	const res = {};
	res.status = sinon.stub().returns(res);
	res.json = sinon.stub().returns(res);
	res.send = sinon.stub()
	return res;
  };

const mockRequest = (body) => {
	return {
		body: body,
	};
};

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
		step("Send mail", async () => {
			await UserController.create_user(mockRequest(users.Joep), res)
			hash = res.send.lastCall.firstArg.hash
			await UserController.get_user_by_username(mockRequest({username: users.Joep.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.mailVerified, 0)
		})
		step("verify", async () => {
			await UserController.verifyMail({params:{idHash: hash}}, res)
			await UserController.get_user_by_username(mockRequest({username: users.Joep.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.mailVerified, 1)
		})
	})
})