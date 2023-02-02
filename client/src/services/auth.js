import {api_axios} from './axios_setup'

export const signup = async item => {
	let data = {
		username  : item.username,
		mail      : item.mail,
		firstName : item.firstName,
		lastName  : item.lastName,
		password  : item.password,
		zipCode   : item.zipCode,
		city      : item.city,
		latitude  : item.latitude,
		longitude : item.longitude,
	};
	let request = {
		url: `/api/auth/signup`, // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json"
		},
		data: JSON.stringify(data)
	};

	const response = await api_axios(request);
	// const response = await instance(request);
	return response;
};

export const signin = async item => {
	let data = {
		username: item.username,
		password: item.password
	};
	let request = {
		url: `api/auth/signin`, // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json"
		},
		data: JSON.stringify(data)
	};

	const response = await api_axios(request);
	return response;
};

export const signin_up_oauth = async (code, longitude, latitude) => {
	let data = {
		code: code,
		longitude: longitude,
		latitude: latitude
	};
	let request = {
		url: `api/auth/signinupoauth`, // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json"
		},
		data: JSON.stringify(data)
	};

	const response = await api_axios(request);
	return response;
};

export const verifyMail = async hash => {
	console.log("verifying url %s", `api/auth/verify/${encodeURIComponent(hash)}`)
	let request = {
		url: `api/auth/verify/${encodeURIComponent(hash)}`, // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json"
		},
		data: JSON.stringify({})
	};

	const response = await api_axios(request);
	return response;
};

export const requestPassReset = async mail => {
	console.log("requesting pass reset for %s", mail)
	let request = {
		url: `api/auth/requestpassreset`, // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json"
		},
		data: JSON.stringify({mail: mail})
	};

	const response = await api_axios(request);
	return response;
};

export const resetPassword = async (hash, pass) => {
	console.log("pass reset for %s with the hash %s", pass, hash)
	let request = {
		url: `api/auth/passreset`,
		method: "post",
		headers: {
			"Content-type": "application/json"
		},
		data: JSON.stringify({hash: hash, password: pass})
	};

	const response = await api_axios(request)
	// console.log("in req: ", response)
	return response;
};