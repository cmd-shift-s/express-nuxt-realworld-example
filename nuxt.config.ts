import { Context } from '@nuxt/vue-app'
import { Configuration } from 'webpack'

import dotenv from 'dotenv'
dotenv.config()

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  mode: 'spa',

  /*
  ** Headers of the page
  */
  head: {
    title: 'Conduit',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Express and Nuxt.js Realworld Example' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: '//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css' },
      { rel: 'stylesheet', type: 'text/css', href: '//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic' },
      { rel: 'stylesheet', href: '//demo.productionready.io/main.css' },
    ]
  },

  /*
  ** Configure the generation of static web application.
  */
  generate: {
    dir: 'dist/public'
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/main.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/dateFns'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    proxy: !isProd,
  },

  proxy: {
    [process.env.API_PREFIX as any]: 'http://localhost:' + process.env.API_PORT
  },

  /*
  ** Auth module configuration
  */
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: 'users/login', method: 'post', propertyName: 'user.token' },
          user: { url: 'user', method: 'get', propertyName: 'user' },
          logout: false
        }
      }
    }
  },

  /*
  ** Customize Nuxt.js router (vue-router)
  */
  router: {
    mode: 'hash',
    base: process.env.ROUTER_BASE,
    linkActiveClass: 'active',
    middleware: [
      'clearError'
    ]
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config: Configuration, ctx: Context) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        if (!config.module) config.module = { rules: [] }
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
