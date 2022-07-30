const { assert }                  = require('chai');

const TagController               = require('../src/controllers/tag.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock')

describe("Tags", () => {
	let res = mockResponse()
	
	describe("Adding tags", () => {
		it("Returns success", async () => {
			await TagController.add_tag_to_user(mockRequest({username: users.Bella.username, tag: "Bitching about Mark"}), res)
			assert.equal(res.send.lastCall.firstArg.code, "SUCCESS")
		})
		it("Missing user", async () => {
			await TagController.add_tag_to_user(mockRequest({username: "youseure", tag: "Bitching about Mark"}), res)
			assert.equal(res.send.lastCall.firstArg.code, "ER_NO_REFERENCED_ROW")
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
	// describe("Removing tags", () => {
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