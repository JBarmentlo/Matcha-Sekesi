const { assert }                  = require('chai');

const UserController              = require('../src/controllers/user.controller')
const test_con		              = require('../src/controllers/test.controller')
const TagController               = require('../src/controllers/tag.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock')

describe("Tags", () => {
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
	describe("Adding tags", () => {
		it("Returns success", async () => {
			await TagController.add_tag_to_user(mockRequest({username: users.Bella.username, tag: "Bitching about Mark"}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		})
		it("Returns success", async () => {
			await TagController.add_tag_to_user(mockRequest({username: users.Bella.username, tag: "Drinking 3 beers"}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		})
		it("Returns success", async () => {
			await TagController.add_tag_to_user(mockRequest({username: users.Jhonny.username, tag: "Drinking 3 beers"}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		})
		it("Duplicate entry", async () => {
			await TagController.add_tag_to_user(mockRequest({username: users.Bella.username, tag: "Drinking 3 beers"}), res)
			assert.equal(res.send.lastCall.firstArg.code, "ER_DUP_ENTRY")
		})
		it("Missing user", async () => {
			await TagController.add_tag_to_user(mockRequest({username: "youseure", tag: "Bitching about Mark"}), res)
			
			assert.equal((res.send.lastCall.firstArg.code == "ER_NO_REFERENCED_ROW_2") || (res.send.lastCall.firstArg.code == "ER_NO_REFERENCED_ROW"))
			
		})
		it("undefined user", async () => {
			await TagController.add_tag_to_user(mockRequest({tag: "Bitching about Mark"}), res)
			assert.equal(res.send.lastCall.firstArg.code, "ER_BAD_NULL_ERROR")
		})
		it("undefined tag", async () => {
			await TagController.add_tag_to_user(mockRequest({username: "youseure"}), res)
			assert.equal(res.send.lastCall.firstArg.code, "ER_BAD_NULL_ERROR")
		})
		it("Too long tag", async () => {
			await TagController.add_tag_to_user(mockRequest({username: users.Bella.username, tag: "Bitching aboutl;kjsd;flkgj;sldkfjg;xldfkjg;ldxkfj,.mdfgm,.cvm,.xcvbm,.cvbm,.cvb.,/mxcvb/.,xmcvb/.,xmcvb/.,xmcvb/.,mcb;lkxcvb;;lkxcvb;l,.m Mark"}), res)
			assert.equal(res.send.lastCall.firstArg.code, "ER_DATA_TOO_LONG")
		})
	})
	describe("Getting tags", () => {
		it("Gets bella's tags", async () => {
			await TagController.get_tags_from_user(mockRequest({username: users.Bella.username}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			assert.isTrue(res.send.lastCall.firstArg.data.map(a => a.tag).includes('Bitching about Mark'))
			assert.isTrue(res.send.lastCall.firstArg.data.map(a => a.tag).includes('Drinking 3 beers'))
		})
		it("Unknown user", async () => {
			await TagController.get_tags_from_user(mockRequest({username: "LOL"}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
			assert.equal(res.send.lastCall.firstArg.data.length, 0)
		})
		it("gets all tags", async () => {
			await TagController.get_all_tags(mockRequest(), res)
			assert.isTrue(res.send.lastCall.firstArg.data.map(a => a.tag).includes('Bitching about Mark'))
			assert.isTrue(res.send.lastCall.firstArg.data.map(a => a.tag).includes('Drinking 3 beers'))
			assert.equal(res.send.lastCall.firstArg.data.length, 2)
		})
	})
	describe("Deleting tags", async () => {
		it("delete existing tag affects 1 row", async () => {
			await TagController.remove_tag_from_user(mockRequest({username: users.Bella.username, tag: "Bitching about Mark"}), res)
			assert.equal(res.send.lastCall.firstArg.data.affectedRows, 1)
		})
		it("it is gone", async () => {
			await TagController.get_tags_from_user(mockRequest({username: users.Bella.username}), res)
			assert.equal(res.send.lastCall.firstArg.data.length, 1)
		})
		it("delete not existing tag", async () => {
			await TagController.remove_tag_from_user(mockRequest({username: users.Bella.username, tag: "Bitching about Mark"}), res)
			assert.equal(res.send.lastCall.firstArg.data.affectedRows, 0)
		})
		it("missing user", async () => {
			await TagController.remove_tag_from_user(mockRequest({username: "LOL", tag: "Bitching about Mark"}), res)
			assert.equal(res.send.lastCall.firstArg.data.affectedRows, 0)
		})
		it("undefined user and tag", async () => {
			await TagController.remove_tag_from_user(mockRequest({}), res)
			assert.equal(res.send.lastCall.firstArg.data.affectedRows, 0)
		})

	})
	// describe("Removing tags", () => {}
	// 	it("Returns success and affected 1", async () => {
	// 		await TagController.remove_tag_from_user(mockRequest({username: users.Bella.username, tag: "Bitching about Mark"}), res)
	// 		assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
	// 		assert.equal(res.send.lastCall.firstArg.data.affectedRows, 1)
	// 	})
	// 	it("Returns success and affected 0", async () => {
	// 		await TagController.remove_tag_from_user(mockRequest({username: users.Bella.username, tag: "Bitching about Mark"}), res)
	// 		assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
	// 		assert.equal(res.send.lastCall.firstArg.data.affectedRows, 0)
	// 	})
	// })
})