import { HttpError } from 'routing-controllers'
/**
 * Exception for 422 HTTP error.
 */
export class UnprocessableEntityError extends HttpError {
  name: string = 'Unprocessable Entity Error'
  constructor(message?: string) {
    super(422, message)
  }
}
