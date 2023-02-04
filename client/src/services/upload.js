import {api_axios} from './axios_setup';


export const uploadImage = async (sekes_tokens, image_file) => {
	// console.log("Upload Image: ", image_file)
	const formData = new FormData()
	formData.append('file', image_file)
	let request = {
		url: "/api/image/upload", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : sekes_tokens.accessToken,
		},
		data: formData
	};
	let response = await api_axios(request)
	// console.log("UPLOad response : ", response)

	return response
}