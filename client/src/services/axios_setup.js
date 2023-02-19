import axios from 'axios';
const api_address = process.env.VUE_APP_MATCHA_SERVER_HOST
export const api_axios = axios.create({
    baseURL: api_address
});