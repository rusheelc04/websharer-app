import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import sessions from 'express-session'
import dotenv from 'dotenv'

import WebAppAuthProvider from 'msal-node-wrapper'

import models from './models.js'

import apiV3Router from './routes/api/v3/apiv3.js'

import { fileURLToPath } from 'url'
import { dirname } from 'path'

dotenv.config()

const authConfig = {
    auth: {
        clientId: process.env.AZURE_CLIENT_ID,
        authority: process.env.AZURE_AUTHORITY,
        clientSecret: process.env.AZURE_CLIENT_SECRET,
        redirectUri: process.env.AZURE_REDIRECT_URI
        // redirectUri: "http://localhost:3000/redirect"
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message)
            },
            piiLoggingEnabled: false,
            logLevel: 3,
        }
    }
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

var app = express()

app.enable('trust proxy')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
    req.models = models
    next()
})

const oneDay = 1000 * 60 * 60 * 24
app.use(sessions({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}))

const authProvider = await WebAppAuthProvider.WebAppAuthProvider.initialize(authConfig)
app.use(authProvider.authenticate())

app.get('/signin', (req, res, next) => {
    return req.authContext.login({
        postLoginRedirectUri: "/", // redirect here after login
    })(req, res, next)
})

app.get('/signout', (req, res, next) => {
    return req.authContext.logout({
        postLogoutRedirectUri: "/", // redirect here after logout
    })(req, res, next)
})

app.use('/api/v3', apiV3Router)
app.use(authProvider.interactionErrorHandler())

export default app