const { assert }                  = require('chai');

const LikeController              = require('../src/controllers/like.controller')
const BlockController             = require('../src/controllers/block.controller')
const UserController              = require('../src/controllers/user.controller')
const NotifController             = require('../src/controllers/notif.controller')
const test_con                    = require('../src/controllers/test.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock');
const { step }                    = require('mocha-steps');

describe('Notifications', () => { 
	let res = mockResponse()
	step("Init db", () => {
		return (Promise.all([
			test_con.clear_db(),
			UserController.create_user_test(mockRequest(users.Jhonny), res),
			UserController.create_user_test(mockRequest(users.Bella), res),
			UserController.create_user_test(mockRequest(users.Mark), res)
		]))
	})
	let notif_id
	step("Create notif", async (done) => {
		ret = await NotifController.create_notif('LIKE', users.Jhonny.username, users.Bella.username)
		assert.equal(ret.code, "SUCCESS")
		notif_id = ret.id
		done()
	})
	step("Get notif", async (done) => {
		await NotifController.get_my_notifs({username: users.Bella.username, body: {limit:10, offset:0},}, res)
		done()
	})
	step("Get notif missing user", async (done) => {
		await NotifController.get_my_notifs({username: "kiki", body: {limit:10, offset:0},}, res)
		done()
	})
	// step("set notif seen", async (done) => {
	// 	await NotifController.set_seen_notif({body: {id: notif_id}, username: users.Bella.username})
	// 	done()
	// })
})