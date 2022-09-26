import axios from "axios";


export const updateUser = async (access_token, user) => {
	console.log("User update for: ", user)
	let request = {
		url: "http://localhost:8081/api/users/updateuser", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
			"x-access-signature" : access_token.signature,
		},
		data: JSON.stringify({update: user})
	};

	const response = await axios(request);
	return response;
}

export const getMyUser = async (access_token) => {
	console.log("Get my user")
	let request = {
		url: "http://localhost:8081/api/users/getmyuser", // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type"       : "application/json",
			"x-access-token"     : access_token.accessToken,
			"x-access-signature" : access_token.signature,
		}
	};
	
	const response = await axios(request);
	return response;
}

export const getUserTags = async (username) => {
	console.log("User update for: ", username)
	let request = {
		url: "http://localhost:8081/api/auth/getusertags", // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type"       : "application/json",
		},
		data: JSON.stringify({username: username})
	};

	const response = await axios(request);
	return response;
}


const createOneUser = async function(rawUser) {

	const sekesualOri = ["Hetero", "Gay", "Bi"];
	const tags = ["Web Dev", "Alcoolic", "Music", "Travel", "Sekes", "Cofee", "Gourmet", "Laughing", "Sunshine"];

	const user = {
		username        : rawUser.login.username,
		firstName       : rawUser.name.first,
		lastName        : rawUser.name.last,
		bio             : "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia ",
		mail            : rawUser.email,
		password        : rawUser.login.password,
		mailVerified    : true,
		gender          : rawUser.gender == "male" ? "Male" : "Female",
		sekesualOri     : sekesualOri[Math.floor(Math.random() * sekesualOri.length)],
		popScore        : Math.random() * 10,
		zipCode         : rawUser.location.postcode,
		city         		: rawUser.location.city,
		isCompleteProfile : true,
		image0          : rawUser.picture.medium,
		profilePic      : rawUser.picture.medium,
		tag_list        : [tags[Math.floor(Math.random() * tags.length)], tags[Math.floor(Math.random() * sekesualOri.length)]],
		longitude       : rawUser.location.coordinates.longitude,
		latitude        : rawUser.location.coordinates.latitude,
		DOB             : rawUser.dob.date.slice(0, 10)
	};

	if (user.tag_list[0] == user.tag_list[1])
		user.tag_list.pop()
	let request = {
		url: "http://localhost:8081/api/users/createusertest",  // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json",
		},
		data: JSON.stringify(user)
	};

	return axios(request);
}

export const createRandomUsers = async (amount) => {
	console.log("Creating ", amount, " users.")

	const res = await fetch('https://randomuser.me/api/?nat=FR&results=' + amount);
	const {results} = await res.json()
	console.log("Raw data: ", results)
	let promises = []
	for (const result of results) {
		promises.push(createOneUser(result))
	}

	return Promise.all(promises)
};

