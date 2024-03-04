import { InternalServerException } from '@src/exceptions/InternalServerException';
import { UnauthorizedException } from '@src/exceptions/UnauthorizedException';
import { BadRequestException } from '@src/exceptions/BadRequestException';
import { ForbiddenException } from '@src/exceptions/ForbiddenException';
import { NotFoundException } from '@src/exceptions/NotFoundException';
import { TimeoutException } from '@src/exceptions/TimeoutException';
import { UnknownException } from '@src/exceptions/UnknownException';

export const isHeartBeatException = (o: unknown) =>
  [
    BadRequestException,
    UnauthorizedException,
    ForbiddenException,
    NotFoundException,
    InternalServerException,
    TimeoutException,
    UnknownException,
  ].some((excptionClass) => o instanceof excptionClass);
