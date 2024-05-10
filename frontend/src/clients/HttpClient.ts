/* istanbul ignore file */ // to cover #29
import { AXIOS_NETWORK_ERROR_CODES, AXIOS_REQUEST_ERROR_CODE } from '@src/constants/resources';
import { InternalServerError } from '@src/errors/InternalServerError';
import { UnauthorizedError } from '@src/errors/UnauthorizedError';
import { BadRequestError } from '@src/errors/BadRequestError';
import axios, { AxiosInstance, HttpStatusCode } from 'axios';
import { ForbiddenError } from '@src/errors/ForbiddenError';
import { NotFoundError } from '@src/errors/NotFoundError';
import { UnknownError } from '@src/errors/UnknownError';
import { TimeoutError } from '@src/errors/TimeoutError';
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
          throw new TimeoutError(error?.message, AXIOS_REQUEST_ERROR_CODE.TIMEOUT);
          //  Can't find any solution to cover below line due to upgrading the msw from v1 to v2
          /* istanbul ignore branch */
        } else if (response && response.status && response.status > 0) {
          const { status, data, statusText } = response;
          const errorMessage = data?.hintInfo ?? statusText;
          const description = data?.message;
          switch (status) {
            case HttpStatusCode.BadRequest:
              throw new BadRequestError(errorMessage, HttpStatusCode.BadRequest, description);
            case HttpStatusCode.Unauthorized:
              throw new UnauthorizedError(errorMessage, HttpStatusCode.Unauthorized, description);
            case HttpStatusCode.NotFound:
              throw new NotFoundError(errorMessage, HttpStatusCode.NotFound, description);
            case HttpStatusCode.Forbidden:
              throw new ForbiddenError(errorMessage, HttpStatusCode.Forbidden, description);
            default:
              if (status >= 500) {
                window.location.href = ROUTE.ERROR_PAGE;
                throw new InternalServerError(errorMessage, status, description);
              }
              throw new UnknownError();
          }
        } else {
          //  Can't find any solution to cover below line due to upgrading the msw from v1 to v2
          /* istanbul ignore next */
          throw new UnknownError();
        }
      },
    );
  }
}
