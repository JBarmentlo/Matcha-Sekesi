import {api_axios} from './axios_setup';


export const updateUser = async (access_token, user) => {
	console.log("User update for: ", user)
	let request = {
		url: "/api/users/updateuser", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		},
		data: JSON.stringify({update: user})
	};

	const response = await api_axios(request);
	return response;
}

export const getMyUser = async (access_token) => {
	let request = {
		url: "/api/users/getmyuser", // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		}
	};
	
	const response = await api_axios(request);
	return response;
}

export const getUserProfile = async (access_token, username) => {
	console.log("Get my user")
	let request = {
		url: `/api/users/getprofile/${username}`, // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		}
	};
	
	const response = await api_axios(request);
	return response;
}

export const consultUserProfile = async (access_token, username) => {
	console.log("consult user", username)
	let request = {
		url: `/api/users/consult/${username}`, // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		}
	};
	
	const response = await api_axios(request);
	console.log("CONSULT res: ", response)
	return response;
}


// TODO why no auth here ?
export const getUserTags = async (username) => {
	console.log("User update for: ", username)
	let request = {
		url: "/api/auth/getusertags", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
		},
		data: JSON.stringify({username: username})
	};

	const response = await api_axios(request);
	return response;
}


export const likeUser = async (access_token, username) => {
	// console.log("like: ", username)
	let request = {
		url: `/api/users/like`, // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		},
		data: JSON.stringify({liked: username})
	};
	
	const response = await api_axios(request);
	console.log("like: ", response)
	return response;
}


export const unlikeUser = async (access_token, username) => {
	console.log("unlike: ", username)
	let request = {
		url: `/api/users/unlike`, // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		},
		data: JSON.stringify({unliked: username})
	};
	
	const response = await api_axios(request);
	console.log("unlike: ", response)
	return response;
}


export const blockUser = async (access_token, username) => {
	console.log("block: ", username)
	let request = {
		url: `/api/users/block`, // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		},
		data: JSON.stringify({blocked: username})
	};
	
	const response = await api_axios(request);
	console.log("block: ", response)
	return response;
}


export const reportUser = async (access_token, username) => {
	try {
		console.log("report: ", username)
		let request = {
			url: `/api/users/report`, // should be replaced after going to production with domain url
			method: "post",
			headers: {
				"Content-type"       : "application/json",
				"x-access-token"     : access_token.accessToken,
			},
			data: JSON.stringify({reported: username})
		};
		
		const response = await api_axios(request);
		console.log("report: ", response)
		blockUser(access_token, username)
		return response;
	}
	catch (e) {
		console.log("What happened in report ?")
	}
	
}


export const unblockUser = async (access_token, username) => {
	console.log("unblock: ", username)
	let request = {
		url: `/api/users/unblock`, // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		},
		data: JSON.stringify({unblocked: username})
	};
	
	const response = await api_axios(request);
	console.log("unblock: ", response)
	return response;
}


export const getMatches = async (access_token) => {
	console.log("get matches: ")
	let request = {
		url: `/api/users/getmatches`, // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		},
	};
	
	const response = await api_axios(request);
	// console.log("matches: ", response)
	return response;
}


export const getLoc = async () => {
	console.log("get Loc: ")
	const res = await api_axios.get('https://ipinfo.io/json?token=e7f3e2a554658c')
	console.log("Located at: ", res)
	return res
}
