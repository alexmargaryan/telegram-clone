import { HttpException, HttpStatus } from "@nestjs/common";

export class BadRequestException extends HttpException {
  constructor(message: string, type?: string) {
    super({ message, type }, HttpStatus.BAD_REQUEST);
  }
}

export class UnauthorizedException extends HttpException {
  constructor(message: string, type?: string) {
    super({ message, type }, HttpStatus.UNAUTHORIZED);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message: string, type?: string) {
    super({ message, type }, HttpStatus.FORBIDDEN);
  }
}

export class NotFoundException extends HttpException {
  constructor(message: string, type?: string) {
    super({ message, type }, HttpStatus.NOT_FOUND);
  }
}

export class ConflictException extends HttpException {
  constructor(message: string, type?: string) {
    super({ message, type }, HttpStatus.CONFLICT);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message: string, type?: string) {
    super({ message, type }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
