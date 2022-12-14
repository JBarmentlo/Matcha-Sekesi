const axios = require('axios')

async function get_mobis() {
	let request = {
		url: 'https://yts.torrentbay.to/api/v2/list_movies.json',
		method: "get",
		headers: {
			"Content-type": "application/json",
            'Accept-Encoding': 'application/json'
		},
        params : {

        }
	};
	const response = await axios(request);
    console.log("movies: ", response.data)
	return response;
}

get_mobis()