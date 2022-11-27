import axios from "axios";


export const getAllTags = async (sekes_tokens) => {
	// console.log("Get all tags")
	let request = {
		url: "http://matcha.yoopster.com:80/api/tags/getall", // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : sekes_tokens.accessToken,
			"x-access-signature" : sekes_tokens.signature,
		},
	};
	let response = await axios(request)

	return response
}

export const updateUserTags = async (sekes_tokens, tag_list) => {
	// console.log("Get all tags")
	let request = {
		url: "http://matcha.yoopster.com:80/api/tags/update", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : sekes_tokens.accessToken,
			"x-access-signature" : sekes_tokens.signature,
		},
		data: JSON.stringify({'tag_list': tag_list})
	};
	let response = await axios(request)

	return response
}