import axios from 'axios';
// const api_address = `${process.env.VUE_APP_MATCHA_HOST}${process.env.VUE_APP_MATCHA_DEFAULT_PORT == '80' || process.env.VUE_APP_MATCHA_DEFAULT_PORT == '443' ? '' : ':' + process.env.VUE_APP_MATCHA_DEFAULT_PORT}`
const api_address = process.env.VUE_APP_MATCHA_SERVER_HOST
export const api_axios = axios.create({
    baseURL: api_address
});