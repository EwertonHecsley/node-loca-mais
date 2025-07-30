import { GenericErrors } from '../GenericError'

export class InternalServerErrorException extends GenericErrors {
  constructor(message: string = 'Internal Server Error') {
    super(message, 500)
    this.name = 'InternalServerErrorException'
  }
}
