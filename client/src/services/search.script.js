import axios from "axios";

export const search = async item => {
  let data = {
    min_age : item.min_age,
	max_age: item.max_age,
	interest_tags: item.interest_tags,
	min_rating: item.min_rating,
	min_km: item.min_km,
  };
  let request = {
    url: "http://localhost:8080/api/auth/search", // should be replaced after going to production with domain url
    method: "post",
    headers: {
      "Content-type": "application/json"
    },
    data: JSON.stringify(data),
  };
  const response = await axios(request);
  return response;
};
