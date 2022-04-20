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
	console.log("done liking")
	return response;
};


export const unlikeUser = async (userCooki, userId) => {
	console.log("unliking user %s with usercooki %o", userId, userCooki)
	let request = {
		url: "http://localhost:8080/api/users/unlike" ,  // should be replaced after going to production with domain url
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
	console.log("getting my likes", userCooki.data.id)
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
	console.log("getting likes by me")
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



export const isLikedByMe = async (userCooki, userId) => {
	console.log("getting is liked by me")
	let request = {
		url: "http://localhost:8080/api/users/islikedbyme/" + encodeURIComponent(userId),  // should be replaced after going to production with domain url
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
