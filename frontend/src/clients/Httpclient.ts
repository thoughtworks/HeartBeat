import axios, { AxiosInstance, HttpStatusCode } from 'axios'
import { BadRequestException } from '@src/exceptions/BadRequestException'
import {
  BAD_REQUEST_ERROR_MESSAGE,
  INTERNAL_SERVER_ERROR_MESSAGE,
  INVALID_TOKEN_ERROR_MESSAGE,
  NOT_FOUND_ERROR_MESSAGE,
} from '@src/constants'
import { UnauthorizedException } from '@src/exceptions/UnauthorizedException'
import { InternalServerException } from '@src/exceptions/InternalServerException'
import { UnknownException } from '@src/exceptions/UnkonwException'
import { NotFoundException } from '@src/exceptions/NotFoundException'

export class HttpClient {
  protected httpTimeout = 20000
  protected axiosInstance: AxiosInstance

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: '/api/v1',
      timeout: this.httpTimeout,
    })
    this.axiosInstance.interceptors.response.use(
      (res) => res,
      (error) => {
        const { response } = error
        if (response && response.status) {
          switch (response.status) {
            case HttpStatusCode.BadRequest:
              throw new BadRequestException(BAD_REQUEST_ERROR_MESSAGE)
            case HttpStatusCode.Unauthorized:
              throw new UnauthorizedException(INVALID_TOKEN_ERROR_MESSAGE)
            case HttpStatusCode.InternalServerError:
              throw new InternalServerException(INTERNAL_SERVER_ERROR_MESSAGE)
            case HttpStatusCode.NotFound:
              throw new NotFoundException(NOT_FOUND_ERROR_MESSAGE)
            default:
              throw new UnknownException()
          }
        }
        return response
      }
    )
  }
}
