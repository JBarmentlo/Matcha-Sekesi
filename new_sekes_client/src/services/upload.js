import axios from "axios";


export const uploadImage = async (sekes_tokens, image_file) => {
	console.log("Upload Image: ", image_file)
	const formData = new FormData()
	formData.append('file', image_file)

	let response = await axios.post("http://localhost:8081/api/upload", formData)
	console.log("UPLOad response : ", response)

	return response
}