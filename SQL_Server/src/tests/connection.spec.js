const { assert } = require('chai');
const chai		= require('chai');
const expect	= chai.expect;
const sinon		= require('sinon');

const db		= require('../db/sql.conn')

describe("Test db connection exists.", () => {
	describe('db.connection._eventsCount test', () => {
		it('Should be equal to 1', async () => {
			let conn = await db.conn
			assert.equal(conn.connection._eventsCount, 1)
		})
	})
})