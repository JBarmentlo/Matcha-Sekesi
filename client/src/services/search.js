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


export const searchUsers = async (access_token, min_age, max_age, required_tags, min_rating, max_rating, zipcodes, offset, limit, order_by, asc_or_desc, desires) => {
	console.log("desiiiIRESIJRESR: ",desires)
	let request = {
		url: "http://localhost:8081/api/users/search_users", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
			"x-access-signature" : access_token.signature,
		},
		data: JSON.stringify({
			min_age       : min_age,
			max_age       : max_age,
			required_tags : required_tags,
			min_rating    : min_rating,
			max_rating    : max_rating,
			zipcodes      : zipcodes,
			offset        : offset,
			limit         : limit,
			order_by      : order_by,
			asc_or_desc   : asc_or_desc,
			desires	      : desires
		})
		
	};

	const response = await axios(request);
	console.log("setrch res:", response)
	return response;
}
