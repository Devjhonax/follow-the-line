import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes.js'
import topicRoutes from './routes/topic.routes.js'
import sessionRoutes from './routes/session.routes.js'
import reflectionRoutes from './routes/reflection.routes.js'
import errorHandler from './middlewares/errorHandler.js'

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.use('/auth', authRoutes)
app.use('/topics', topicRoutes)
app.use('/sessions', sessionRoutes)
app.use('/topics', reflectionRoutes)

app.get('/', (req, res) => res.status(200).json({message: "Welcome to api"}))

app.use(errorHandler)

export default app

