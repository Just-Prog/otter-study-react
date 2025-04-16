import Axios from 'axios'

const api = Axios.create({
    baseURL: import.meta.env.REACT_APP_API_URL,
});

api.interceptors.request.use(config => {
    console.log(config);
})

api.interceptors.response.use(config => {
    console.log(config);
})

export default api;