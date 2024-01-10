import axios, { AxiosInstance, HttpStatusCode } from 'axios';
import { BadRequestException } from '@src/exceptions/BadRequestException';
import { UnauthorizedException } from '@src/exceptions/UnauthorizedException';
import { InternalServerException } from '@src/exceptions/InternalServerException';
import { UnknownException } from '@src/exceptions/UnkonwException';
import { NotFoundException } from '@src/exceptions/NotFoundException';
import { ForbiddenException } from '@src/exceptions/ForbiddenException';
import { TimeoutException } from '@src/exceptions/TimeoutException';

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
        const { response } = error;
        if (response && response.status) {
          const { status, data, statusText } = response;
          const errorMessage = data?.hintInfo ?? statusText;
          switch (status) {
            case HttpStatusCode.BadRequest:
              throw new BadRequestException(errorMessage, status);
            case HttpStatusCode.Unauthorized:
              throw new UnauthorizedException(errorMessage, status);
            case HttpStatusCode.NotFound:
              throw new NotFoundException(errorMessage, status);
            case HttpStatusCode.Forbidden:
              throw new ForbiddenException(errorMessage, status);
            case HttpStatusCode.InternalServerError:
              throw new InternalServerException(errorMessage, status);
            case HttpStatusCode.ServiceUnavailable:
              throw new TimeoutException(errorMessage, status);
            default:
              throw new UnknownException();
          }
        } else {
          throw new UnknownException();
        }
      }
    );
  }
}
