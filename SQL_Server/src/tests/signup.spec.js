const { assert } = require('chai');
const sinon		= require('sinon');

const AuthController	= require('../controllers/auth.controller')
const db = require('../db/sql.conn')

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
})