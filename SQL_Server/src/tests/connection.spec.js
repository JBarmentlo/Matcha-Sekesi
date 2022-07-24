const { assert } = require('chai');
const chai		= require('chai');
const expect	= chai.expect;
const sinon		= require('sinon');

const db		= require('../db/sql.conn')

describe("Test db connection exists.", () => {
	describe('db.connection._eventsCount test', async () => {
		let conn = await db.conn
		assert.equal(db.connection._eventsCount, 1)
	})
})