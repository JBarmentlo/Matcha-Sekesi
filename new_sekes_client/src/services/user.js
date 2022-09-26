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

export const createRandomUser = async () => {
	console.log("Creating user", Math.random() * 10)

	const sekesualOri = ["Hetero", "Gay", "Bi"];
	const tags = ["Web Dev", "Alcoolic", "Music", "Travel", "Sekes", "Cofee", "Gourmet", "Laughing", "Sunshine"];


	const res = await fetch('https://randomuser.me/api/?nat=FR');
	const {results} = await res.json()
	const user = {
			username        : results[0].login.username,
			firstName       : results[0].name.first,
			lastName        : results[0].name.last,
			bio             : "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia ",
			mail            : results[0].email,
			password        : results[0].login.password,
			mailVerified    : true,
			gender          : results[0].gender == "male" ? "Male" : "Female",
			sekesualOri     : sekesualOri[Math.floor(Math.random() * sekesualOri.length)],
			popScore        : Math.random() * 10,
			zipCode         : results[0].location.postcode,
			city         		: results[0].location.city,
			isCompleteProfile : true,
			image0          : results[0].picture.medium,
			profilePic      : results[0].picture.medium,
			tag_list        : [tags[Math.floor(Math.random() * tags.length)], tags[Math.floor(Math.random() * sekesualOri.length)]],
			longitude       : results[0].location.coordinates.longitude,
			latitude        : results[0].location.coordinates.latitude,
			DOB             : results[0].dob.date.slice(0, 10)
	};
	console.log("USER: %o", user)
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
	const response = await axios(request);
	console.log("created user res: ", response)
	return response;
};

