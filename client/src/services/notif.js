import {api_axios} from './axios_setup';


export const getMyNotifs = async (access_token, offset, limit) => {
	// console.log("get notifs ", offset, limit)
	let request = {
		url: "/api/notif/getall", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		},
		data: JSON.stringify({limit: limit, offset: offset})
	};
	const response = await api_axios(request);
	// console.log("Notifs res: ", response)
	return response;
}

export const getMyNewNotifs = async (access_token, last_time, offset, limit) => {
	// console.log("get notifs ", offset, limit)
	let request = {
		url: "/api/notif/getnew", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		},
		data: JSON.stringify({limit: limit, offset: offset, last_time: last_time})
	};
	const response = await api_axios(request);
	// console.log("Notifs res: ", response)
	return response;
}

export const getCurrentTime = async (access_token) => {
	let request = {
		url: "/api/notif/gettime",
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		}
	};
	const response = await api_axios(request);
	console.log("TIME res: ", response)
	return response;
}

export const setSeenNotifs = async (access_token, notif_ids) => {
	// console.log("setting see: ", notif_ids)
	let request = {
		url: "/api/notif/setseen", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		},
		data: JSON.stringify({id_list: notif_ids})
	};
	const response = await api_axios(request);
	// console.log("Notifs res: ", response)
	return response;
}

export const deleteNotifs = async (access_token, id) => {
	// console.log("delete notif")
	let request = {
		url: "/api/notif/delete", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		},
		data: JSON.stringify({id: id})
	};
	const response = await api_axios(request);
	return response;
}
