import axios from "axios";

const createOneUser = async function(rawUser, tags) {

	const sekesualOri = ["Hetero", "Gay", "Bi"];

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
		url: "http://localhost:8081/api/test/createuser",  // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json",
		},
		data: JSON.stringify(user)
	};

	return axios(request);
}

export const createRandomUsers = async (amount, tags) => {
	console.log("Creating ", amount, " users.")

	const res = await fetch('https://randomuser.me/api/?nat=FR&results=' + amount);
	const {results} = await res.json()
	console.log("Raw data: ", results)
	let promises = []
	for (const result of results) {
		promises.push(createOneUser(result, tags))
	}

	return Promise.all(promises)
};


// export const createRandomlikes = async (amount) => {
// 	console.log("Creating ", amount, " likes per user.")

// 	const users = 
// 	const {results} = await res.json()
// 	console.log("Raw data: ", results)
// 	let promises = []
// 	for (const result of results) {
// 		promises.push(createOneUser(result))
// 	}

// 	return Promise.all(promises)
// };
