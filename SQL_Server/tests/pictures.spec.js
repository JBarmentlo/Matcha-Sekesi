const { assert }                  = require('chai');
const UserController              = require('../src/controllers/user.controller')
const ImageController             = require('../src/controllers/image.controller')
const test_con                    = require('../src/controllers/test.controller')
const users                       = require('./data/users.mock')
const {mockResponse, mockRequest} = require('./data/res.req.mock');
const { step }                    = require('mocha-steps');

// describe('Notifications', () => { 
//     let res = mockResponse()
//     step("Init db", () => {
//         return (Promise.all([
//             test_con.clear_db(),
//             testController.create_user_test(mockRequest(users.Jhonny), res),
//             testController.create_user_test(mockRequest(users.Bella), res),
//             testController.create_user_test(mockRequest(users.Mark), res)
//         ]))
//     })
//     step("Create and add picture", async () => {
//         let url = ImageController.insert_fake_picture_test(filename = 'test.png', username = users.Jhonny.username)
//         let res = mockResponse()
//         await UserController.update_user_test(mockRequest({update: {image1: url}}, users.Jhonny.username), res)
//         assert.equal(res.send.lastCall.firstArg.code, 'SUCCESS')
//         assert.equal(res.send.lastCall.firstArg.data.affectedRows, 1)
//         return Promise.resolve()
//     })
// })
