import axios from "axios";


export const getMyMessages = async (access_token) => {
	console.log("get messages ")
	let request = {
		url: "http://localhost:8081/api/chat/getall", // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
			"x-access-signature" : access_token.signature,
		},
	};
	const response = await axios(request);
	// console.log("MSG res: ", response)
	return response;
}


export const getConvo = async (access_token, username, offset, limit, polling = false) => {
	// console.log("get messages ", polling)
	if (polling == true) {
		polling = false
	}
	let request = {
		url: "http://localhost:8081/api/chat/get_conversation", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
			"x-access-signature" : access_token.signature,
		},
		data: JSON.stringify({
			username : username,
			offset   : offset,
			limit    : limit,
		})
	};
	const response = await axios(request);
	// console.log("MSG res: ", response)
	return response;
}

