const { assert }                  = require('chai');

const LikeController              = require('../src/controllers/like.controller')
const ConsultController           = require('../src/controllers/consult.controller')
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
	step("Create notif", async () => {
		ret = await NotifController.create_notif('LIKE', users.Jhonny.username, users.Bella.username)
		assert.equal(ret.code, "SUCCESS")
		notif_id = ret.id
		Promise.resolve()
	})
	step("Get notif", async () => {
		await NotifController.get_my_notifs({username: users.Bella.username, body: {limit:10, offset:0},}, res)
		Promise.resolve()
	})
	step("Get notif missing user", async () => {
		await NotifController.get_my_notifs({username: "kiki", body: {limit:10, offset:0},}, res)
		Promise.resolve()
	})
	step("set notif seen", async () => {
		await NotifController.set_seen_notif({body: {id: notif_id}, username: users.Bella.username}, res)
		Promise.resolve()
	})
	step("set missing notif seen", async () => {
		await NotifController.set_seen_notif({body: {id: 1000}, username: "lkjsdf"}, res)
		Promise.resolve()
	})
	step("Consult notif", async () => {
		await ConsultController.consult_user(mockRequest({consulter: users.Mark.username, consulted: users.Jhonny.username}), res)
		await NotifController.get_my_notifs(mockRequest({limit: 10, offset: 0}, users.Jhonny.username), res)
		assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		assert.equal(res.send.lastCall.firstArg.data[0].source_user, users.Mark.username)
	})
	step("Blocking blocks notifs", async () => {
		await BlockController.block_user(mockRequest({blocker: users.Jhonny.username, blocked: users.Mark.username}), res)
		await NotifController.get_my_notifs(mockRequest({limit: 10, offset: 0}, users.Jhonny.username), res)
		assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		assert.equal(res.send.lastCall.firstArg.data.length, 0)
	})
	step("match notif", async () => {
		await BlockController.un_block_user(mockRequest({unblocker: users.Jhonny.username, unblocked: users.Mark.username}), res)

		await LikeController.like_user(mockRequest({liker: users.Jhonny.username, liked: users.Mark.username}), res)
		await LikeController.like_user(mockRequest({liker: users.Mark.username, liked: users.Jhonny.username}), res)
		await LikeController.un_like_user(mockRequest({unliker: users.Mark.username, unliked: users.Jhonny.username}), res)
		await NotifController.get_my_notifs(mockRequest({limit: 10, offset: 0}, users.Jhonny.username), res)
		assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		assert.equal(JSON.stringify(res.send.lastCall.firstArg.data.map(e => e.type)), JSON.stringify(['CONSULT', 'MATCH', "UNMATCH"]))
	})
})