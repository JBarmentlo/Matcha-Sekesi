import axios from "axios";


export const blockUser = async (userCooki, userId) => {
	console.log("block user %s with usercooki %o", userId, userCooki)
	let request = {
		url: "http://localhost:8080/api/users/block",  // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json",
			"x-access-token" : userCooki.data.accessToken,
			"x-access-signature" : userCooki.data.signature,
		},
		data: JSON.stringify({blocked_id: userId})
	};
	const response = await axios(request);
	return response;
};


export const blocksOfMe = async (userCooki) => {
	console.log("getting blocks of me")
	let request = {
		url: "http://localhost:8080/api/users/blocksofme",  // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type": "application/json",
			"x-access-token" : userCooki.data.accessToken,
			"x-access-signature" : userCooki.data.signature,
		}
	};
	const response = await axios(request);
	return response;
};


export const blocksByMe = async (userCooki) => {
	console.log("getting blocks by me")
	let request = {
		url: "http://localhost:8080/api/users/blocksbyme",  // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type": "application/json",
			"x-access-token" : userCooki.data.accessToken,
			"x-access-signature" : userCooki.data.signature,
		}
	};
	const response = await axios(request);
	return response;
};
