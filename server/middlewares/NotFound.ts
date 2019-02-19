import { Middleware, ExpressMiddlewareInterface, NotFoundError } from 'routing-controllers'
import { Request, Response, NextFunction } from 'express'

@Middleware({ type: 'after' })
export class NotFoundHandler implements ExpressMiddlewareInterface {

  use(_req: Request, res: Response, _next?: NextFunction): void {
    if (!res.headersSent) {
      throw new NotFoundError()
    }
  }

}
