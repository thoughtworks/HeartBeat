import axios from 'axios'

const BASE_URL = 'https://jsonplaceholder.typicode.com'
export const verifyBoard = () => axios.get(`${BASE_URL}/posts`).then((res) => res)
