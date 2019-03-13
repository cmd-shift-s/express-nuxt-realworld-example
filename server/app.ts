import 'reflect-metadata'
import { useExpressServer, useContainer, RoutingControllersOptions, Action } from 'routing-controllers'
import { Container } from 'typedi'
import express from 'express'
import morgan from 'morgan'
import { NotFoundHandler, ErrorHandler } from './middlewares'
import jwt from 'jsonwebtoken'
import { User } from '~/models'

require('dotenv').config()

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'

useContainer(Container)

export const app = express()

if (isDev || isProd) {
  app.use(morgan(process.env.LOG_LEVEL))
}

if (isProd) {
  app.use(express.static(__dirname + '/../public'))
}

const middlewares = [
  NotFoundHandler, ErrorHandler
]

function jwtChecker(action: Action, fn: (decoded: string | object) => any): Promise<any> {
  let token = action.request.headers['authorization']

  if (token) {
    token = token.split(/Token\:?\s?/i)
    token = token[token.length > 1 ? 1 : 0].trim()
  }

  if (token) {
    return new Promise((resolve) => {
      jwt.verify(token, process.env.JWT_SECRET, (err: jwt.VerifyErrors, decoded: string | object) => {
        if (err) {
          return resolve(false)
        }

        const result = fn(decoded)
        resolve(result)
      })
    })
  } else {
    return Promise.resolve(false)
  }
}

const options: RoutingControllersOptions = {
  routePrefix: process.env.API_PREFIX,
  defaultErrorHandler: false,
  controllers: [`${__dirname}/controllers/index.{ts,js}`],
  authorizationChecker: (action: Action, roles?: string[]) =>
    jwtChecker(action, decoded => {
      if (!roles || roles.length === 0) {
        return true
      } else {
        const user: User = (decoded as any).user
        const hasRole = roles.some(role => user.roles.includes(role))
        return hasRole
      }
    }),
  currentUserChecker: (action: Action) =>
    jwtChecker(action, decoded => (decoded as any).user),
  middlewares
}

useExpressServer(app, options)
