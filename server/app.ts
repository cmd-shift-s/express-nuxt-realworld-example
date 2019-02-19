import 'reflect-metadata'
import { useExpressServer } from 'routing-controllers'
import express from 'express'
import morgan from 'morgan'
import { NotFoundHandler, ErrorHandler } from './middlewares'

require('dotenv').config()

const isProd = process.env.NODE_ENV === 'production'

export const app = express()

app.use(morgan(process.env.LOG_LEVEL))

if (isProd) {
  app.use(express.static(__dirname + '/../public'));
}

const middlewares = [
  NotFoundHandler, ErrorHandler
]

useExpressServer(app, {
  routePrefix: process.env.API_PREFIX,
  defaultErrorHandler: false,
  controllers: [`${__dirname}/controllers/*.{ts,js}`],
  middlewares
})
