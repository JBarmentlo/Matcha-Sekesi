import axios from "axios";


export const getAllUsers = async (access_token) => {
	console.log("Getting all users")
	let request = {
		url: "http://localhost:8081/api/users/getallusers", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
			"x-access-signature" : access_token.signature,
		},
	};

	const response = await axios(request);
	return response;
}
