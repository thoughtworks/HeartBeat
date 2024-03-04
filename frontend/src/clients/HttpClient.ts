import { AXIOS_NETWORK_ERROR_CODES, HEARTBEAT_EXCEPTION_CODE } from '@src/constants/resources';
import { InternalServerException } from '@src/exceptions/InternalServerException';
import { UnauthorizedException } from '@src/exceptions/UnauthorizedException';
import { BadRequestException } from '@src/exceptions/BadRequestException';
import { ForbiddenException } from '@src/exceptions/ForbiddenException';
import { NotFoundException } from '@src/exceptions/NotFoundException';
import { UnknownException } from '@src/exceptions/UnknownException';
import { TimeoutException } from '@src/exceptions/TimeoutException';
import axios, { AxiosInstance, HttpStatusCode } from 'axios';
import { ROUTE } from '@src/constants/router';

export class HttpClient {
  protected httpTimeout = 300000;
  protected axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: '/api/v1',
      timeout: this.httpTimeout,
    });
    this.axiosInstance.interceptors.response.use(
      (res) => res,
      (error) => {
        const { code, response } = error;
        if (AXIOS_NETWORK_ERROR_CODES.some((predefinedCode) => predefinedCode === code)) {
          throw new TimeoutException(error?.message, HEARTBEAT_EXCEPTION_CODE.TIMEOUT);
        } else if (response && response.status && response.status > 0) {
          const { status, data, statusText } = response;
          const errorMessage = data?.hintInfo ?? statusText;
          const description = data?.message;
          switch (status) {
            case HttpStatusCode.BadRequest:
              throw new BadRequestException(errorMessage, HttpStatusCode.BadRequest, description);
            case HttpStatusCode.Unauthorized:
              throw new UnauthorizedException(errorMessage, HttpStatusCode.Unauthorized, description);
            case HttpStatusCode.NotFound:
              throw new NotFoundException(errorMessage, HttpStatusCode.NotFound, description);
            case HttpStatusCode.Forbidden:
              throw new ForbiddenException(errorMessage, HttpStatusCode.Forbidden, description);
            default:
              if (status >= 500) {
                window.location.href = ROUTE.ERROR_PAGE;
                throw new InternalServerException(errorMessage, status, description);
              }
              throw new UnknownException();
          }
        } else {
          throw new UnknownException();
        }
      },
    );
  }
}
