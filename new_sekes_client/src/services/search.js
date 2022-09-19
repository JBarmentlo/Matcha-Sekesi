import axios from "axios";


export const getAllUsers = async (access_token, min_age, max_age, interest_tags, min_rating, zipcodes) => {
	console.log("Getting all users")
	let request = {
		url: "http://localhost:8081/api/users/getallusers", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
			"x-access-signature" : access_token.signature,
		},
		data: JSON.stringify({
			min_age       : min_age,
			max_age       : max_age,
			interest_tags : interest_tags,
			min_rating    : min_rating,
			zipcodes      : zipcodes
		})
		
	};

	const response = await axios(request);
	return response;
}
