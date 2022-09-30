import axios from "axios";


export const getMyMessages = async (access_token) => {
	// console.log("get messages ")
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


export const getConvo = async (access_token, username, offset, limit) => {
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
	// console.log("convo res: ", response)
	return response;
}

export const sendMsg = async (access_token, username, msg, convoId) => {
	console.log("sending msg: ", 'username: ', username, 'msg: ', msg)
	let request = {
		url: "http://localhost:8081/api/chat/send_message", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
			"x-access-signature" : access_token.signature,
		},
		data: JSON.stringify({
			username : username,
			msg      : msg,
			convoId  : convoId
		})
	};
	console.log("MSG data:", request.data)
	const response = await axios(request);
	// console.log("MSG res: ", response)
	return response;
}