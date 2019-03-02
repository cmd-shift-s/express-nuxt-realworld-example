import { Middleware, ExpressErrorMiddlewareInterface, HttpError } from 'routing-controllers'
import { Request, Response, NextFunction } from 'express'

@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {

  error(error: HttpError, _req: Request, res: Response, _next?: NextFunction) {
    const message = error.message ? error.message : error.name
    res.status(error.httpCode)
    res.json({
      errors: {
        body: Array.isArray(message) ? message : [message]
      }
    })
  }

}
