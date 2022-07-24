
const db		= require('../db/sql.test_conn')

export const mochaHooks = {
	async beforeAll() {
	  // skip all tests for bob
		await db.clear_all()
	  }
	}
  };