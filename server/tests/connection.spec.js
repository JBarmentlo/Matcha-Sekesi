const { assert } = require('chai');
const chai		= require('chai');
const expect	= chai.expect;
const sinon		= require('sinon');

const db		= require('../src/db/sql.conn')

describe("Test db connection exists.", () => {
	describe('db.connection._eventsCount test', () => {
		it('Should be equal to 1', async () => {
			let conn = await db.conn
			assert.isTrue(conn._eventsCount >= 1)
		})
	})
})