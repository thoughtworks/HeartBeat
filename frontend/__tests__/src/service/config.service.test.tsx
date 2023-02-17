import axios from 'axios'
import { verifyBoard } from '@src/service/config.service'
import mocked = jest.mocked

jest.mock('axios')

describe('config step', () => {
  test('should return 200 status when verifyBoard is succeed', async () => {
    const mAxiosGet = mocked(axios.get)
    expect(jest.isMockFunction(mAxiosGet)).toBeTruthy()
    mAxiosGet.mockResolvedValueOnce({ status: 200 })

    const result = await verifyBoard()

    expect(result.status).toEqual(200)
  })
})
