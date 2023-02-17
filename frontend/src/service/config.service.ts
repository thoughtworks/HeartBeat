import axios from 'axios'

const URL = 'http://localhost:3000/verifyBoard'
export const verifyBoard = () => axios.get(URL).then((res) => res)
