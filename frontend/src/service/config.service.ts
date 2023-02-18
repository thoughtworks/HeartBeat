import axios from 'axios'

const URL = '/api/v1/board/jira'
export const verifyBoard = () => axios.get(URL).then((res) => res)
