import axios from "axios";


export const getMyNotifs = async (access_token, offset, limit) => {
	console.log("Get my user")
	let request = {
		url: "http://localhost:8081/api/notif/getall", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
			"x-access-signature" : access_token.signature,
		},
		data: JSON.stringify({limit: limit, offset: offset})
	};
	const response = await axios(request);
	console.log("Notifs res: ", response)
	return response;
}
