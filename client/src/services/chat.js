import {api_axios} from './axios_setup';

export const getMyMessages = async (access_token) => {
	// console.log("get messages ")
	let request = {
		url: "/api/chat/getall", // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		},
	};
	const response = await api_axios(request);
	// console.log("MSG res: ", response)
	return response;
}

export const getMyNewMessages = async (access_token, start_time) => {
	// console.log("get messages ")
	let request = {
		url: "/api/chat/getallnew", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		},
		data: JSON.stringify({
			last_time: start_time
		})
	};
	const response = await api_axios(request);
	// console.log("MSG res: ", response)
	return response;
}

export const getMyNewMessagesId = async (access_token, last_id) => {
	// console.log("get messages ")
	let request = {
		url: "/api/chat/getallnew", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		},
		data: JSON.stringify({
			last_id: last_id
		})
	};
	const response = await api_axios(request);
	// console.log("MSG res: ", response)
	return response;
}

export const getCurrentId = async (access_token) => {
	let request = {
		url: "/api/chat/getlastid",
		method: "get",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		}
	};
	const response = await api_axios(request);
	return response;
}


export const getConvo = async (access_token, username, offset, limit) => {
	let request = {
		url: "/api/chat/get_conversation", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		},
		data: JSON.stringify({
			username : username,
			offset   : offset,
			limit    : limit,
		})
	};
	const response = await api_axios(request);
	// console.log("convo res: ", response)
	return response;
}

export const sendMsg = async (access_token, username, msg, convoId) => {
	console.log("sending msg: ", 'username: ', username, 'msg: ', msg)
	let request = {
		url: "/api/chat/send_message", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		},
		data: JSON.stringify({
			username : username,
			msg      : msg,
			convoId  : convoId
		})
	};
	console.log("MSG data:", request.data)
	const response = await api_axios(request);
	// console.log("MSG res: ", response)
	return response;
}