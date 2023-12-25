import axios from "axios";

const api = axios.create({
    baseURL: "https://evangadi-fourm.onrender.com/api"
});

export default api;