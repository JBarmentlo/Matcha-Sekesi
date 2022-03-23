import axios from "axios";

export const signup = async item => {
  let data = {
    username    : item.username,
    mail        : item.mail,
    password    : item.password,
  };
  let request = {
    url: "http://localhost:8080/api/auth/signup", // should be replaced after going to production with domain url
    method: "post",
    headers: {
      "Content-type": "application/json"
    },
    data: JSON.stringify(data)
  };

  const response = await axios(request);
  return response;
};

export const login = async item => {
  let data = {
    username: item.username,
    password: item.password
  };
  let request = {
    url: "http://localhost:8080/api/auth/signin", // should be replaced after going to production with domain url
    method: "post",
    headers: {
      "Content-type": "application/json"
    },
    data: JSON.stringify(data)
  };

  const response = await axios(request);
  return response;
};

export const verify = async hashId => {
  console.log("verifying url %s", "http://localhost:8080/api/auth/verify/" + encodeURIComponent(hashId))
  let request = {
    url: "http://localhost:8080/api/auth/verify/" + encodeURIComponent(hashId), // should be replaced after going to production with domain url
    method: "get",
    headers: {
      "Content-type": "application/json"
    },
    data: JSON.stringify({})
  };

  const response = await axios(request);
  return response;
};