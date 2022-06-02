const sdk = require('api')('@cometchat/v3#10yo3ct1l3cvd14i');

sdk.server(`https://${process.env.COMET_APP_ID}.api-${process.env.COMET_APP_REGION}.cometchat.io/v3/users`);

exports.create_user = (user_id, name) => {
	return sdk['creates-user']({
		metadata: {
		  '@private': {
			email: 'user@email.com',
			contactNumber: '0123456789'
		  }
		},
		uid: user_id,
		name: name,
		link: `http://localhost:8081/hisprofile/${user_id}`,
		withAuthToken: true
	  }, {
		apiKey: process.env.COMET_API_KEY
	  })
};

exports.create_auth_token = (user_id) => {
	return sdk['create-authtoken']({force: false}, {uid: user_id, apiKey: process.env.COMET_API_KEY})
};

exports.update_user = (user_id, name) => {
	return sdk['update-user']({
		metadata: {
		  '@private': {
			email: 'user@email.com',
			contactNumber: '0123456789'
		  }
		},
		name: name,
		link: `http://localhost:8081/hisprofile/${user_id}`,
	  }, {
			uid: user_id,
			apiKey: process.env.COMET_API_KEY
		})
};


exports.delete_user = (user_id) => {
	return sdk['delete-user']({permanent: false}, {uid: user_id, apiKey: process.env.COMET_API_KEY })
};

exports.add_friend = (user_id, friend_id) => {
	return sdk['add-friend']({accepted: [friend_id]}, {uid: user_id, apiKey: process.env.COMET_API_KEY })
};
