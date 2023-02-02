import {api_axios} from './axios_setup';

const createOneUser = async function(rawUser, tags) {

	const sekesualOri = ["Hetero", "Gay", "Bi"];
	const gifs = ["https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif", "https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif", "https://media.giphy.com/media/dK0tjRx03fhlK/giphy.gif", "https://media.giphy.com/media/hhYDWei0c7pDy/giphy.gif", "https://media.giphy.com/media/l0HlAnslBY1SCnKxy/giphy.gif"]
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
		popScore        : Math.random() * 5,
		zipCode         : rawUser.location.postcode,
		city         		: rawUser.location.city,
		isCompleteProfile : true,
		gif             :  gifs[Math.floor(Math.random() * gifs.length)],
		image0          : "https://images.unsplash.com/photo-1580421828423-4b36a8ca65fb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEzNzYzNn0?utm_source=dictionnaire&utm_medium=referral",
		profilePic      : rawUser.picture.medium,
		tag_list        : [tags[Math.floor(Math.random() * tags.length)], tags[Math.floor(Math.random() * tags.length)]],
		longitude       : rawUser.location.coordinates.longitude,
		latitude        : rawUser.location.coordinates.latitude,
		DOB             : rawUser.dob.date.slice(0, 10)
	};
	if (user.tag_list[0] == user.tag_list[1])
		user.tag_list.pop()
	// console.log("creating user: ", user)
	let request = {
		url: "/api/test/createuser",  // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json",
		},
		data: JSON.stringify(user)
	};

	return api_axios(request);
}

export const createRandomUsers = async (amount, tags) => {
	console.log("Creating ", amount, " users.")

	const res = await fetch('https://randomuser.me/api/?nat=FR&results=' + amount);
	const {results} = await res.json()
	console.log("Raw data: ", results)
	let promises = []
	for (const result of results) {
		promises.push(createOneUser(result, tags))
		// console.log("create_user start one")
	}
	// console.log("PROMISES LENFNTT", promises.length)

	return Promise.all(promises)
};


export const createRandomlikes = async (min, max) => {
	console.log("Creating ", min, "-", max, " likes per user.")

	let request = {
		url: "/api/test/getuserlist",  // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type": "application/json",
		},
	};

	const user_list = await (await api_axios(request)).data.data;
	let like_list = []

	for (const user of user_list){
		let n_likes = Math.floor(Math.random() * (max - min)) + min

		for (let i = 0; i < n_likes; i++) {
			let random_user = user_list[Math.floor(Math.random() * user_list.length)]
			let like = {"liker": user, "liked": random_user}
			like_list.push(like)
		}
	}

	let request_like = {
		url: "/api/test/createlikes",  // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json",
		},
		data: JSON.stringify({'like_list': like_list})
	};
	console.log("LIKELIST: ", request_like.length)
	let like_res = await api_axios(request_like)
	console.log("LIKE RESL ", like_res)
	return like_res
};


export const createRandomConsults = async (min, max) => {
	console.log("Creating ", min, "-", max, " consults per user.")

	let request = {
		url: "/api/test/getuserlist",  // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type": "application/json",
		},
	};

	const user_list = await (await api_axios(request)).data.data;
	let consult_list = []
	console.log("USERLIST: ", user_list)
	for (const user of user_list){
		let n_consults = Math.floor(Math.random() * (max - min)) + min

		for (let i = 0; i < n_consults; i++) {
			let random_user = user_list[Math.floor(Math.random() * user_list.length)]
			let consult = {"consulter": user, "consulted": random_user}
			console.log("randuser",random_user)
			consult_list.push(consult)
		}
	}

	let request_consult = {
		url: "/api/test/createconsults",  // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json",
		},
		data: JSON.stringify({'consult_list': consult_list})
	};
	console.log("consultLIST: ", request_consult)
	let consult_res = await api_axios(request_consult)
	console.log("consult RESL ", consult_res)
	return consult_res

};


export const createRandomblocks = async (min, max) => {
	console.log("Creating ", min, "-", max, " blocks per user.")

	let request = {
		url: "/api/test/getuserlist",  // should be replaced after going to production with domain url
		method: "get",
		headers: {
			"Content-type": "application/json",
		},
	};

	const user_list = await (await api_axios(request)).data.data;
	let block_list = []

	for (const user of user_list){
		let n_blocks = Math.floor(Math.random() * (max - min)) + min

		for (let i = 0; i < n_blocks; i++) {
			let random_user = user_list[Math.floor(Math.random() * user_list.length)]
			let block = {"blocker": user, "blocked": random_user}
			block_list.push(block)
		}
	}

	let request_block = {
		url: "/api/test/createblocks",  // should be replaced after going to production with domain url
		method: "post",
		headers: {
			"Content-type": "application/json",
		},
		data: JSON.stringify({'block_list': block_list})
	};
	console.log("blockLIST: ", request_block)
	let block_res = await api_axios(request_block)
	console.log("block RESL ", block_res)
	return block_res
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
