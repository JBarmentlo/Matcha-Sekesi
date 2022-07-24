const { assert } = require('chai');
const chai		= require('chai');
const expect	= chai.expect;
const sinon		= require('sinon');

AuthController	= require('../controllers/auth.controller')

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
	username: 'jhonny',
	mail: 'joepbarmentlo@gmail.com',
	lastName: 'last name',
	firstName: 'first name',
}


describe('Test signup', () => {
	describe('Create existing user', () => {
		it('should status 200', async () => {
			let req = mockRequest(jhonnyBody)
			let res = mockResponse()
			await AuthController.signup(req, res)
			assert.isTrue(res.status.calledWith(200))
		})
		it('should say username taken', async () => {
			let req = mockRequest(jhonnyBody)
			let res = mockResponse()
			await AuthController.signup(req, res)
			assert.isTrue(res.send.calledWith({message: "Duplicate entry 'jhonny' for key 'USERS_username_uindex'"}))
		})
	})
})