import axios from "axios";


export const getAllTags = async (sekes_tokens) => {
	console.log("Get all tags")
	let request = {
		url: "http://localhost:8081/api/tags/getall", // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : sekes_tokens.accessToken,
			"x-access-signature" : sekes_tokens.signature,
		},
	};
	let response = await axios(request)
	console.log("Get all tags : ", response)

	return response
}