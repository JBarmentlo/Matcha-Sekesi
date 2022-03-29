import axios from "axios";
// import { $cookies } from "vue/types/umd";


export const getMyUserDetails = async (userCooki) => {
	console.log("getting user details")
	let request = {
		url: "http://localhost:8080/api/users/getmyuser",  // should be replaced after going to production with domain url
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


export const getUserDetails = async (userCooki, userId) => {
	console.log("getting user details for %s", userId)
	let request = {
		url: "http://localhost:8080/api/users/getuser/" + encodeURIComponent(userId),  // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type": "application/json",
			"x-access-token" : userCooki.data.accessToken,
			"x-access-signature" : userCooki.data.signature,
		},
		data: JSON.stringify({userId: userId})
	};
	console.log(request)
	const response = await axios(request);
	return response;
};



export const updateUserProfile = async (userCooki, newProfile) => {
	console.log("updAting user details %o", userCooki)
	let request = {
		url: "http://localhost:8080/api/users/updateuser",  // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json",
			"x-access-token" : userCooki.data.accessToken,
			"x-access-signature" : userCooki.data.signature,
		},
		data: JSON.stringify({update: newProfile})
	};
	const response = await axios(request);
	return response;
};


function 	makeTag(name)
{
	return({key: '', value: name})
}

export const createRandomUser = async () => {
	console.log("Creating user", Math.random() * 10)

	const sekesualOri = ["Hetero", "Gay", "Bi"];
	const tags = ["Web Dev", "Alcoolic", "Music", "Travel", "Sekes", "Cofee", "Gourmet", "Laughing", "Sunshine"];


	const res = await fetch('https://randomuser.me/api/?nat=FR');
	const {results} = await res.json()
	console.log(results)
    const user = {
        username        : results[0].login.username,
        firstName       : results[0].name.first,
        lastName        : results[0].name.last,
        bio             : "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
        mail            : results[0].email,
        password        : results[0].login.password,
        mailVerified    : true,
        gender          : results[0].gender == "male" ? "Male" : "Female",
        sekesualOri     : sekesualOri[Math.floor(Math.random() * sekesualOri.length)],
        popScore        : Math.random() * 10,
        zipCode         : results[0].location.postcode,
        city         	: results[0].location.city,
        completeProfile : true,
        pictures        : [results[0].picture.medium],
        profilePic      : results[0].picture.medium,
        tags            : [makeTag(tags[Math.floor(Math.random() * tags.length)]), makeTag(tags[Math.floor(Math.random() * sekesualOri.length)])],
        longitude       : results[0].location.coordinates.longitude,
        latitude        : results[0].location.coordinates.latitude
    };
	console.log("USER: %o", user)
	if (user.tags[0] == user.tags[1])
		user.tags.pop()
	let request = {
		url: "http://localhost:8080/api/users/createuser",  // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json",
		},
		data: JSON.stringify(user)
	};
	const response = await axios(request);
	return response;
};

export const createUser = async (newProfile) => {
	console.log("Creating user %o", userCooki)
	let request = {
		url: "http://localhost:8080/api/users/createuser",  // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json",
			"x-access-token" : userCooki.data.accessToken,
			"x-access-signature" : userCooki.data.signature,
		},
		data: JSON.stringify({user: newProfile})
	};
	const response = await axios(request);
	return response;
};


export const getTags = async (userCooki) => {
	console.log("getting tags %o", userCooki)
	let request = {
		url: "http://localhost:8080/api/users/gettags",  // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type": "application/json",
			"x-access-token" : userCooki.data.accessToken,
			"x-access-signature" : userCooki.data.signature,
		}
	};
	const response = await axios(request);
	return response;
};


export const getAllUsers = async (userCooki) => {
	console.log("getting users with usercooki %o", userCooki)
	let request = {
		url: "http://localhost:8080/api/users/getallusers",  // should be replaced after going to production with domain url
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
