import {api_axios} from './axios_setup';

export const searchUsers = async (access_token, min_age, max_age, required_tags, min_rating, max_rating, zipcodes, offset, limit, order_by, asc_or_desc) => {
	let request = {
		url: "/api/users/search_users", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
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
		})
		
	};

	const response = await api_axios(request);
	return response;
}

export const searchUsersInitial = async (access_token, offset, limit) => {
	let request = {
		url: "/api/users/search_users_init", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
		},
		data: JSON.stringify({
			offset    : offset,
			limit     : limit,
		})
		
	};
	const response = await api_axios(request);
	return response;
}
