import { HttpError } from 'routing-controllers'
/**
 * Exception for 422 HTTP error.
 */
export class UnprocessableEntityError extends HttpError {
  name: string = 'UnprocessableEntityError'
  constructor(message: string | string[]) {
    super(422, message as string)
  }
}
