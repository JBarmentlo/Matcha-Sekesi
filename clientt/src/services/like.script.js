import axios from "axios";


export const likeUser = async (userCooki, userId) => {
	console.log("liking user %s with usercooki %o", userId, userCooki)
	let request = {
		url: "http://localhost:8080/api/users/like",  // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json",
			"x-access-token" : userCooki.data.accessToken,
			"x-access-signature" : userCooki.data.signature,
		},
		data: JSON.stringify({liked_id: userId})
	};
	const response = await axios(request);
	return response;
};


export const likesOfMe = async (userCooki) => {
	console.log("liking user %s with usercooki %o", userCooki.data.id, userCooki)
	let request = {
		url: "http://localhost:8080/api/users/likesofme",  // should be replaced after going to production with domain url
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


export const likesByMe = async (userCooki) => {
	console.log("liking user %s with usercooki %o", userCooki.data.id, userCooki)
	let request = {
		url: "http://localhost:8080/api/users/likesbyme",  // should be replaced after going to production with domain url
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
