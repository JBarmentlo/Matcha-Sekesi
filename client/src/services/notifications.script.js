import axios from "axios";


export const getMyNotifs = async (userCooki) => {
	console.log("getting my user details")
	let request = {
		url: "http://localhost:8080/api/users/notifsforme",  // should be replaced after going to production with domain url
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


export const setNotifViewed = async (userCooki, notif_id) => {
	console.log("getting my user details")
	let request = {
		url: "http://localhost:8080/api/users/notifsetviewed",  // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type": "application/json",
			"x-access-token" : userCooki.data.accessToken,
			"x-access-signature" : userCooki.data.signature,
		},
		data: JSON.stringify({notif_id : notif_id})
	};
	const response = await axios(request);
	return response;
};