import axios from "axios";
// import { $cookies } from "vue/types/umd";


export const getMyUserDetails = async (userCooki) => {
	console.log("getting user details")
	let request = {
		url: "http://localhost:8080/api/users/getmyuser",  // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type": "application/json",
			"x-access-token" : userCooki.data.accessToken,
			"x-access-signature" : userCooki.data.signature,
		},
		data: JSON.stringify({})
	};
	const response = await axios(request);
	return response;
};


export const updateUserProfile = async (userCooki, newProfile) => {
	console.log("updAting user details %o", userCooki)
	let request = {
		url: "http://localhost:8080/api/users/updateuser",  // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json",
			"x-access-token" : userCooki.data.accessToken,
			"x-access-signature" : userCooki.data.signature,
		},
		data: JSON.stringify({update: newProfile})
	};
	const response = await axios(request);
	return response;
};

