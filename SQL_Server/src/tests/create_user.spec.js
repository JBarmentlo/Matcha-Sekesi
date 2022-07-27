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


describe('Test create user', () => {
	let res = mockResponse()

	describe('Create Jhonny user Test', () => {
		it('should just work', async () => {
			let req = mockRequest(userJoni)
			await UserController.create_user_test(req, res)
			assert.isTrue(res.status.calledWith(200))
		})
	})
	describe('Get user by id', () => {
		it('should get him', async () => {
			let inserted_id = res.send.lastCall.lastArg.id
			let req = mockRequest({id: inserted_id})
			await UserController.get_user_by_id(req, res)
			assert.isTrue(res.status.calledWith(200))
		})
	})
})