const { assert }     = require('chai');
const sinon          = require('sinon');

const UserController = require('../controllers/user.controller')
const db             = require('../db/sql.conn')

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

const userJoni = {
	username          : 'Jhonny le bege',
	firstName         : 'Jhonny',
	lastName          : 'Corleone',
	bio               : 'I runne the import export biziness.',
	mail              : 'Joni@mafia.com',
	password          : 'lepass',
	mailVerified      : true,
	gender            : "Male",
	sekesualOri       : "bi",
	popScore          : 5,
	zipCode           : '75010',
	city              : 'Parigi',
	completeProfile   : true,
	longitude         : 1.1,
	latitude          : 2.2,
	isCompleteProfile : true,
};


describe('Test signup', () => {
	// describe('Create Jhonny user', () => {
	// 	it('should status 200', async () => {
	// 		let req = mockRequest(userJoni)
	// 		let res = mockResponse()
	// 		await AuthController.signup(req, res)
	// 		assert.isTrue(res.status.calledWith(200))
	// 	})
	// })
	describe('Create Jhonny user Test', () => {
		it('should just work', async () => {
			let req = mockRequest(userJoni)
			let res = mockResponse()

			await UserController.create_user_test(req, res)
			assert.isTrue(res.status.calledWith(200))
		})
	})
})